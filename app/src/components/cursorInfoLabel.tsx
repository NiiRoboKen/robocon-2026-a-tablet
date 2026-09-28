import { useCanvasStore } from "../stores/useCanvasStore";
import { getConfig } from "../config";
import {
  coordinatesPixelToWorld,
  pixelToWorld,
  roundPoint,
} from "../utils/coordinate";

export function CursorInfoLabel() {
  const { colorMode, pixelScale, cursorDirection, cursorPosition } =
    useCanvasStore();

  if (!cursorPosition) return;

  const fieldSize = getConfig(colorMode).field.size;
  const origin = getConfig(colorMode).robot.originPosition;
  const realPosition = coordinatesPixelToWorld(
    roundPoint(pixelToWorld(cursorPosition, pixelScale)),
    origin,
    fieldSize,
  );

  return (
    <>
      <label>
        Cursor Position: x={realPosition.x}, y={realPosition.y}, dir=
        {cursorDirection}
      </label>
    </>
  );
}
