import { buildPositionMessage } from "../utils/messageBuilder";
import { useCanvasStore } from "../stores/useCanvasStore";
import { useWebSocketStore } from "../stores/useWebSocketStore";
import { useRobotStore } from "../stores/useRobotStore";
import { getConfig } from "../config";
import {
  coordinatesPixelToWorld,
  directionToDisplayDegrees,
  pixelToWorld,
  roundPoint,
} from "../utils/coordinate";
import { Button, Box, type BoxProps } from "@chakra-ui/react";

export function SendPositionButton(props: BoxProps) {
  const { colorMode, selectedPosition, pixelScale, selectedDirection } =
    useCanvasStore();
  const send = useWebSocketStore((s) => s.send);
  const robotState = useRobotStore((s) => s.robotState);
  const isDisabled = robotState?.gamepad_used ?? false;

  const handleClick = () => {
    if (selectedPosition === null || selectedDirection === null) {
      console.warn("[SendPositionButton] 座標が未選択");
      return;
    }

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
    <Box pos="absolute" borderWidth="5px" {...props}>
      <Button w="100%" h="100%" onClick={handleClick} disabled={isDisabled}>
        目標座標送信
      </Button>
    </Box>
  );
}
