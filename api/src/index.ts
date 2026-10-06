import {
  initSerial,
  sendToSerial,
  onSerialLine,
  resendLastToSerial,
} from "./serial.ts";
import type { MessageType, WebSocketCommands } from "./types.ts";

const STATIC_DIR = process.env.STATIC_DIR ?? null;

const WS_TOPIC = "broadcast";

interface WsMessage<T = unknown> {
  type: MessageType;
  timestamp: number;
  payload: T;
}

function buildMessage<T>(type: MessageType, payload: T): WsMessage<T> {
  return { type, timestamp: Date.now(), payload };
}

async function serveStatic(pathname: string): Promise<Response | null> {
  if (!STATIC_DIR) return null;

  const rel = pathname === "/" ? "/index.html" : pathname;
  const file = Bun.file(`${STATIC_DIR}${rel}`);
  if (await file.exists()) {
    return new Response(file);
  }
  return null;
}

initSerial();

const server = Bun.serve({
  port: Number(process.env.PORT ?? 3000),
  async fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === "/ws") {
      const upgraded = server.upgrade(req);
      if (!upgraded) {
        return new Response("WebSocket upgrade failed", { status: 400 });
      }
      return undefined;
    }

    if (url.pathname === "/health") {
      return Response.json({ status: "ok" });
    }

    const staticRes = await serveStatic(url.pathname);
    if (staticRes) return staticRes;

    // SPA フォールバック
    if (STATIC_DIR) {
      const indexFile = Bun.file(`${STATIC_DIR}/index.html`);
      if (await indexFile.exists()) {
        return new Response(indexFile);
      }
    }

    return new Response("Not Found", { status: 404 });
  },
  websocket: {
    open(ws) {
      console.log("[WS] Client connected");
      ws.subscribe(WS_TOPIC);
    },
    message(ws, raw) {
      const text =
        typeof raw === "string" ? raw : new TextDecoder().decode(raw);
      console.log(`[WS] Received: ${text}`);

      try {
        const msg: WsMessage = JSON.parse(text);

        if (msg.type == "ping") {
          ws.send(JSON.stringify(buildMessage("pong", {})));
          return;
        }

        const serialMsg =
          msg.type === "command" &&
          msg.payload &&
          typeof (msg.payload as { command?: unknown }).command === "string"
            ? { type: (msg.payload as { command: string }).command, timestamp: msg.timestamp }
            : msg;

        void sendToSerial(serialMsg).then((ok) => {
          if (ok) {
            console.log(`[Serial] Forwarded message type=${serialMsg.type}`);
          }
        });

        switch (msg.type) {
          case "command": {
            const payload = msg.payload as {
              command: WebSocketCommands;
            };
            console.log(`[WS] Command: ${payload.command}`);

            const ack = buildMessage("status", {
              state: `ack:${payload.command}`,
            });
            ws.send(JSON.stringify(ack));
            break;
          }
          case "target_position": {
            const payload = msg.payload as {
              x: number;
              y: number;
              direction: number;
            };
            console.log(
              `[WS] Position update: x=${payload.x}, y=${payload.y}, direction=${payload.direction}`,
            );
            break;
          }
          case "belt_launch": {
            const payload = msg.payload as {
              acceleration: number;
            };
            console.log(`[WS] Launch Belt: x=${payload.acceleration}`);
            break;
          }
          default: {
            console.log(`[WS] Unknown type: ${msg.type}`);
            break;
          }
        }
      } catch {
        console.error("[WS] Failed to parse message");
        const err = buildMessage("error", { message: "Invalid JSON" });
        ws.send(JSON.stringify(err));
      }
    },
    close(ws) {
      console.log("[WS] Client disconnected");
      ws.unsubscribe(WS_TOPIC);
    },
  },
});

console.log(`API server listening on ${server.url}`);

// シリアルから届いた 1 行(JSON)を WS クライアントへ配信する。
onSerialLine((line) => {
  let parsed: (Partial<WsMessage> & { type?: string }) | null = null;
  try {
    parsed = JSON.parse(line) as Partial<WsMessage> & { type?: string };
  } catch {
    console.warn(`[Serial] Failed to parse line as JSON: ${line}`);
    return;
  }

  if (typeof parsed.type !== "string") {
    console.warn(`[Serial] Ignoring line without type: ${line}`);
    return;
  }

  if (parsed.type === "log" || parsed.type === "raw") {
    return;
  }

  if (parsed.type === "resend_request") {
    const reason =
      typeof (parsed as { reason?: unknown }).reason === "string"
        ? (parsed as { reason: string }).reason
        : undefined;
    void resendLastToSerial(reason);
  }

  // timestamp が無ければ付与して正規化する。
  const normalized = {
    ...parsed,
    type: parsed.type,
    timestamp:
      typeof parsed.timestamp === "number" ? parsed.timestamp : Date.now(),
  };
  server.publish(WS_TOPIC, JSON.stringify(normalized));
  console.log(`[Serial -> WS] type=${parsed.type}`);
});
