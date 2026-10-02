import { buildPositionMessage } from "../utils/messageBuilder";
import { useCanvasStore } from "../stores/useCanvasStore";
import { useWebSocketStore } from "../stores/useWebSocketStore";
import { getConfig } from "../config";
import {
  coordinatesPixelToWorld,
  directionToDisplayDegrees,
  pixelToWorld,
  roundPoint,
} from "../utils/coordinate";
import { Button } from "@chakra-ui/react";

export function SendPositionButton() {
  const { colorMode, selectedPosition, pixelScale, selectedDirection } =
    useCanvasStore();
  const send = useWebSocketStore((s) => s.send);

  const handleClick = () => {
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

    send(buildPositionMessage(worldPosition, worldDirection));
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      bg="orange"
      width="10%"
      height="100%"
    >
      目標座標送信
    </Button>
  );
}
