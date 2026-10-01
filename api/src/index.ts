import { initSerial, sendToSerial } from "./serial.ts";

// 本番ビルド成果物（app の dist）の配置先。
// 開発時は未設定でよい（静的ファイルは Vite dev server が配信する）。
const STATIC_DIR = process.env.STATIC_DIR ?? null;

type MessageType =
  "ping" | "pong" | "position_update" | "command" | "status" | "error";

interface WsMessage<T = unknown> {
  type: MessageType;
  timestamp: number;
  payload: T;
}

function buildMessage<T>(type: MessageType, payload: T): WsMessage<T> {
  return { type, timestamp: Date.now(), payload };
}

/**
 * STATIC_DIR 配下の静的ファイルを配信する。
 * - 見つかればその Response を返す
 * - 見つからなければ null（呼び出し側で SPA フォールバック等を行う）
 */
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

    // WebSocket アップグレード
    if (url.pathname === "/ws") {
      const upgraded = server.upgrade(req);
      if (!upgraded) {
        return new Response("WebSocket upgrade failed", { status: 400 });
      }
      return undefined;
    }

    // ヘルスチェック
    if (url.pathname === "/health") {
      return Response.json({ status: "ok" });
    }

    // 静的ファイル配信（STATIC_DIR が設定されている本番のみ）
    const staticRes = await serveStatic(url.pathname);
    if (staticRes) return staticRes;

    // SPA フォールバック: 未知のパスは index.html を返す
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

        void sendToSerial(msg).then((ok) => {
          if (ok) {
            console.log(`[Serial] Forwarded message type=${msg.type}`);
          }
        });

        switch (msg.type) {
          case "command": {
            const payload = msg.payload as {
              command: string;
              params?: Record<string, unknown>;
            };
            console.log(`[WS] Command: ${payload.command}`, payload.params);

            const ack = buildMessage("status", {
              state: `ack:${payload.command}`,
            });
            ws.send(JSON.stringify(ack));
            break;
          }
          case "position_update": {
            const payload = msg.payload as {
              position: { x: number; y: number };
            };
            console.log("[WS] Position update for:", payload.position);
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
    },
  },
});

console.log(`API server listening on ${server.url}`);
