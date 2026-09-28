import { useCanvasStore } from "../stores/useCanvasStore";
import { getConfig } from "../config";
import {
  coordinatesPixelToWorld,
  directionToDisplayDegrees,
  pixelToWorld,
  roundPoint,
} from "../utils/coordinate";

export function SelectedInfoLabel() {
  const { colorMode, pixelScale, selectedPosition, selectedDirection } =
    useCanvasStore();

  if (!selectedPosition || selectedDirection === null) return;

  const origin = getConfig(colorMode).robot.originPosition;
  const realPosition = coordinatesPixelToWorld(
    roundPoint(pixelToWorld(selectedPosition, pixelScale)),
    origin,
  );

  return (
    <>
      <label>
        Selected Position: x={realPosition.x}, y={realPosition.y}, dir=
        {Math.round(directionToDisplayDegrees(selectedDirection))}
      </label>
    </>
  );
}
