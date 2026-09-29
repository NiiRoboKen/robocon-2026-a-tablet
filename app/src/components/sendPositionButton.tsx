import type { RefObject } from "react";
import type { WebSocketClient } from "../services/websocketClient";
import { buildPositionMessage } from "../utils/messageBuilder";
import { useCanvasStore } from "../stores/useCanvasStore";
import { getConfig } from "../config";
import {
  coordinatesPixelToWorld,
  directionToDisplayDegrees,
  pixelToWorld,
  roundPoint,
} from "../utils/coordinate";

interface SendPositionButtonProps {
  wsClient: RefObject<WebSocketClient | null>;
}

export function SendPositionButton({ wsClient }: SendPositionButtonProps) {
  const { colorMode, selectedPosition, pixelScale, selectedDirection } =
    useCanvasStore();
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

    // 表示（SelectedInfoLabel）と同じ変換経路で実世界座標・度数へ変換する。
    const origin = getConfig(colorMode).robot.originPosition;
    const worldPosition = coordinatesPixelToWorld(
      roundPoint(pixelToWorld(selectedPosition, pixelScale), 0),
      origin,
    );
    const worldDirection = Math.round(
      directionToDisplayDegrees(selectedDirection),
    );

    client.send(buildPositionMessage(worldPosition, worldDirection));
  };

  return (
    <button type="button" onClick={handleClick}>
      目標座標送信
    </button>
  );
}
