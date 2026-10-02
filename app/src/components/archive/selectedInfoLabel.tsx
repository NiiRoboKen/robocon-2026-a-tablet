import { useCanvasStore } from "@/stores/useCanvasStore";
import { getConfig } from "@/config";
import {
  coordinatesPixelToWorld,
  directionToDisplayDegrees,
  pixelToWorld,
  roundPoint,
} from "@/utils/coordinate";
import { Box, type BoxProps, Card } from "@chakra-ui/react";

export function SelectedInfoLabel(props: BoxProps) {
  const { colorMode, pixelScale, selectedPosition, selectedDirection } =
    useCanvasStore();

  let displayText: string;
  if (!selectedPosition || selectedDirection === null) {
    displayText = "x=null, y=null, dir=null";
  } else {
    const origin = getConfig(colorMode).robot.originPosition;
    const realPosition = coordinatesPixelToWorld(
      roundPoint(pixelToWorld(selectedPosition, pixelScale)),
      origin,
    );
    displayText = `x=${realPosition.x}, y=${realPosition.y}, dir=${Math.round(directionToDisplayDegrees(selectedDirection))}`;
  }

  return (
    <Box pos="absolute" borderWidth="5px" {...props}>
      <Card.Root width="100%">
        <Card.Body>
          <Card.Title>Selected Position</Card.Title>
          <Card.Description>{displayText}</Card.Description>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
