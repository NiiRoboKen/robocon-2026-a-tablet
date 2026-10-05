import { useEffect } from "react";
import { WebSocketClient } from "../services/websocketClient";
import { useWebSocketStore } from "../stores/useWebSocketStore";
import { useRobotStore } from "../stores/useRobotStore";
import type {
  ErrorPayload,
  RobotStatePayload,
  WsMessage,
} from "../types/websocket";

export function useWebSocket() {
  const { setClient, setConnected } = useWebSocketStore();
  const { setRobotState, setPosition } = useRobotStore();

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const url = `${protocol}//${window.location.host}/ws`;

    const client = new WebSocketClient(url);
    setClient(client);

    client.onConnectionChange = setConnected;

    const unsubscribe = client.subscribe((msg: WsMessage) => {
      switch (msg.type) {
        case "pong": {
          console.log("[WS] Pong received:", msg.timestamp);
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
          console.log(`[ESP] robot status`);
          break;
        }
        case "position_update": {
          const position = msg.payload as {
            x: number;
            y: number;
            direction: number;
          };
          setPosition(position);
          console.log(
            `[ESP] position update, x=${position.x}, y=${position.y}, dir=${position.direction}`,
          );
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
  }, [setClient, setConnected, setRobotState]);
}
