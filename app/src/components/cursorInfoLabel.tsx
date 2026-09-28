import { useCanvasStore } from "../stores/useCanvasStore";
import { getConfig } from "../config";
import {
  coordinatesPixelToWorld,
  directionToDisplayDegrees,
  pixelToWorld,
  roundPoint,
} from "../utils/coordinate";

export function CursorInfoLabel() {
  const { colorMode, pixelScale, cursorDirection, cursorPosition } =
    useCanvasStore();

  if (!cursorPosition || cursorDirection === null) return;

  const origin = getConfig(colorMode).robot.originPosition;
  const realPosition = coordinatesPixelToWorld(
    roundPoint(pixelToWorld(cursorPosition, pixelScale)),
    origin,
  );

  return (
    <>
      <label>
        Cursor Position: x={realPosition.x}, y={realPosition.y}, dir=
        {Math.round(directionToDisplayDegrees(cursorDirection))}
      </label>
    </>
  );
}
