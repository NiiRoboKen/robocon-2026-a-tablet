import type { RefObject } from "react";
import type { WebSocketClient } from "../services/websocketClient";
import { buildPositionMessage } from "../utils/messageBuilder";
import { useCanvasStore } from "../stores/useCanvasStore";
import { pixelToWorld, roundPoint } from "../utils/coordinate";

interface SendPositionButtonProps {
  /** WebSocketClientインスタンスへのref */
  wsClient: RefObject<WebSocketClient | null>;
}

export function SendPositionButton({ wsClient }: SendPositionButtonProps) {
  const { selectedPosition, pixelScale, selectedDirection } = useCanvasStore();
  const handleClick = () => {
    const client = wsClient.current;
    if (!client) {
      console.warn("[SendAemOpenButton] WebSocket未接続");
      return;
    }
    if (selectedPosition === null || selectedDirection === null) {
      console.warn("[SendPositionButton] 座標が未選択");
      return;
    }
    client.send(
      buildPositionMessage(
        roundPoint(pixelToWorld(selectedPosition, pixelScale), 0),
        selectedDirection,
      ),
    );
  };

  return (
    <button type="button" onClick={handleClick}>
      目標座標送信
    </button>
  );
}
