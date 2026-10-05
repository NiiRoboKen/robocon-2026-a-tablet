import { Arrow, Line } from "react-konva";
import { useCanvasStore } from "../../stores/useCanvasStore";
import type { Point2D } from "../../types";
import { useRobotStore } from "../../stores/useRobotStore";

function CrosshairMarker({
  position,
  cursorDir,
  robotDir,
  robotColor,
  pixelScale,
}: {
  position: Point2D;
  cursorDir: number;
  robotDir: number;
  robotColor: "red" | "blue";
  pixelScale: number;
}) {
  const crossSize = 10;
  const arrowLineLength = 1000 * pixelScale;

  return (
    <>
      <Line
        points={[
          position.x - crossSize,
          position.y,
          position.x + crossSize,
          position.y,
        ]}
        stroke={robotColor}
        strokeWidth={5}
      />
      <Line
        points={[
          position.x,
          position.y - crossSize,
          position.x,
          position.y + crossSize,
        ]}
        stroke={robotColor}
        strokeWidth={5}
      />

      {/* 現在角度 */}
      <Arrow
        points={[
          position.x,
          position.y,
          position.x + arrowLineLength * Math.cos(robotDir),
          position.y - arrowLineLength * Math.sin(robotDir),
        ]}
        stroke={robotColor}
        strokeWidth={5}
      />

      {/* 目標角度 */}
      <Arrow
        points={[
          position.x,
          position.y,
          position.x + arrowLineLength * Math.cos(cursorDir),
          position.y - arrowLineLength * Math.sin(cursorDir),
        ]}
        stroke="Green"
        strokeWidth={5}
      />
    </>
  );
}

export function InteractionLayer() {
  const { colorMode, selectedPosition, cursorDirection, pixelScale } =
    useCanvasStore();
  const { robotStatus } = useRobotStore();

  const RobotRad = ((robotStatus.direction + 90) * Math.PI) / 180;
  return (
    <>
      {selectedPosition && cursorDirection !== null && (
        <CrosshairMarker
          position={selectedPosition}
          cursorDir={cursorDirection}
          robotDir={RobotRad}
          robotColor={colorMode}
          pixelScale={pixelScale}
        />
      )}
    </>
  );
}
