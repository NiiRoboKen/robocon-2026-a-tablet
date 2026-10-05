import { useEffect } from "react";
import { WebSocketClient } from "../services/websocketClient";
import { useWebSocketStore } from "../stores/useWebSocketStore";
import { useRobotStore } from "../stores/useRobotStore";
import type {
  InboundMessage,
  StatusPayload,
  ErrorPayload,
  RobotStatePayload,
} from "../types/websocket";

export function useWebSocket() {
  const { setClient, setConnected, setLastMessage } = useWebSocketStore();
  const { setRobotStatus, setRobotState } = useRobotStore();

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const url = `${protocol}//${window.location.host}/ws`;

    const client = new WebSocketClient(url);
    setClient(client);

    client.onConnectionChange = setConnected;

    const unsubscribe = client.subscribe((msg: InboundMessage) => {
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
          break;
        }
        // ESP → tablet 方向
        case "robot_state": {
          const payload = msg.payload as RobotStatePayload;
          setRobotState(payload);
          break;
        }
        case "log": {
          // ESP からのログ。level に応じてコンソールへ出力する。
          const level = msg.level;
          const text = `[ESP] ${msg.msg}`;
          if (level === "error") console.error(text);
          else if (level === "warn") console.warn(text);
          else console.log(text);
          break;
        }
        case "raw": {
          // デコード未対応/サイズ不一致の受信データ。
          console.log(`[ESP][raw] msg_type=${msg.msg_type}`, msg.data);
          break;
        }
      }
    });

    client.connect();

    return () => {
      unsubscribe();
      client.disconnect();
      setClient(null);
    };
  }, [
    setClient,
    setConnected,
    setLastMessage,
    setRobotStatus,
    setRobotState,
  ]);
}
