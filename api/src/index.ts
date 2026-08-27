/**
 * Bun WebSocket サーバー
 * /app の WsMessage<T> 形式に対応
 */

interface WsMessage<T = unknown> {
  type: string;
  timestamp: number;
  payload: T;
}

function buildMessage<T>(type: string, payload: T): WsMessage<T> {
  return { type, timestamp: Date.now(), payload };
}

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
      const msg = buildMessage("status", {
        state: "connected",
      });
      ws.send(JSON.stringify(msg));
    },
    message(ws, raw) {
      const text =
        typeof raw === "string" ? raw : new TextDecoder().decode(raw);
      console.log(`[WS] Received: ${text}`);

      try {
        const msg: WsMessage = JSON.parse(text);

        // メッセージタイプに応じたハンドリング
        switch (msg.type) {
          case "ping": {
            console.log("[WS] Ping");
            const ack = buildMessage("pong", {});
            ws.send(JSON.stringify(ack));
            break;
          }
          case "command": {
            const payload = msg.payload as {
              command: string;
              params?: Record<string, unknown>;
            };
            console.log(`[WS] Command: ${payload.command}`, payload.params);

            // コマンドに対するACK応答
            const ack = buildMessage("status", {
              state: `ack:${payload.command}`,
            });
            ws.send(JSON.stringify(ack));
            break;
          }
          // case "position_update": {
          //   const payload = msg.payload as {
          //     target: string;
          //     position: { x: number; y: number };
          //   };
          //   console.log(
          //     `[WS] Position update for ${payload.target}:`,
          //     payload.position,
          //   );

          //   // 受信確認を返す
          //   const ack = buildMessage("status", {
          //     state: "moving",
          //     position: payload.position,
          //   });
          //   ws.send(JSON.stringify(ack));
          //   break;
          // }
          default: {
            // 未知のタイプはエコー
            console.log(`[WS] Unknown type: ${msg.type}`);
            const echo = buildMessage("echo", { original: msg });
            ws.send(JSON.stringify(echo));
            break;
          }
        }
      } catch {
        // JSON パース失敗時はエラーメッセージを返す
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
