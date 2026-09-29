import { build } from "bun";
import { initSerial, sendToSerial } from "./serial.ts";

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

initSerial();

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": () => new Response("Robocon 2026 API"),
    "/health": () => Response.json({ status: "ok" }),
  },
  fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === "/ws") {
      const upgraded = server.upgrade(req);
      if (!upgraded) {
        return new Response("WebSocket upgrade failed", { status: 400 });
      }
      return undefined;
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
