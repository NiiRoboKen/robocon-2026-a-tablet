import { useCanvasStore } from "../stores/useCanvasStore";
import { getConfig } from "../config";
import {
  coordinatesPixelToWorld,
  pixelToWorld,
  roundPoint,
} from "../utils/coordinate";

export function SelectedInfoLabel() {
  const { colorMode, pixelScale, selectedPosition, selectedDirection } =
    useCanvasStore();

  if (!selectedPosition) return;

  const fieldSize = getConfig(colorMode).field.size;
  const origin = getConfig(colorMode).robot.originPosition;
  const realPosition = coordinatesPixelToWorld(
    roundPoint(pixelToWorld(selectedPosition, pixelScale)),
    origin,
    fieldSize,
  );

  return (
    <>
      <label>
        Selected Position: x={realPosition.x}, y={realPosition.y}, dir=
        {selectedDirection}
      </label>
    </>
  );
}
