import { useEffect } from "react";
import { WebSocketClient } from "../services/websocketClient";
import { useWebSocketStore } from "../stores/useWebSocketStore";
import type {
  WsMessage,
  StatusPayload,
  ErrorPayload
} from "../types/websocket";

export function useWebSocket() {
  const { setClient, setConnected, setLastMessage, setRobotStatus } =
    useWebSocketStore();

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const url = `${protocol}//${window.location.host}/ws`;

    const client = new WebSocketClient(url);
    setClient(client);

    client.onConnectionChange = setConnected;

    const unsubscribe = client.subscribe((msg: WsMessage) => {
      setLastMessage(msg);

      switch (msg.type) {
        case "pong": {
          console.log("[WS] Pong received:", msg.timestamp);
          break;
        }
        case "status": {
          const payload = msg.payload as StatusPayload;
          setRobotStatus(payload);
          break;
        }
        case "error": {
          const payload = msg.payload as ErrorPayload;
          console.error(payload.message);
        }
      }
    });

    client.connect();

    return () => {
      unsubscribe();
      client.disconnect();
      setClient(null);
    };
  }, [setClient, setConnected, setLastMessage, setRobotStatus]);
}
