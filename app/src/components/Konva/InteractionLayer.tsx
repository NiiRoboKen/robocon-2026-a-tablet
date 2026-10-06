import { Arrow, Line, Rect } from "react-konva";
import { Fragment } from "react";
import type { KonvaEventObject } from "konva/lib/Node";
import { useCanvasStore } from "../../stores/useCanvasStore";
import type { Point2D } from "../../types";
import { useRobotStore } from "../../stores/useRobotStore";
import { useWebSocketStore } from "../../stores/useWebSocketStore";
import { getConfig } from "../../config";
import { coordinatesWorldToPixel } from "../../utils/coordinate";
import { buildPositionMessage } from "../../utils/messageBuilder";

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
        listening={false}
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
        listening={false}
      />

      <Arrow
        points={[
          position.x,
          position.y,
          position.x + arrowLineLength * Math.cos(robotDir),
          position.y - arrowLineLength * Math.sin(robotDir),
        ]}
        stroke={robotColor}
        strokeWidth={5}
        listening={false}
      />

      <Arrow
        points={[
          position.x,
          position.y,
          position.x + arrowLineLength * Math.cos(cursorDir),
          position.y - arrowLineLength * Math.sin(cursorDir),
        ]}
        stroke="Green"
        strokeWidth={5}
        listening={false}
      />
    </>
  );
}

export function InteractionLayer() {
  const { colorMode, selectedPosition, cursorDirection, pixelScale } =
    useCanvasStore();
  const { position } = useRobotStore();
  const send = useWebSocketStore((s) => s.send);
  const config = getConfig(colorMode);

  const RobotRad = ((position.direction + 90) * Math.PI) / 180;
  const arrowLength = 1000;

  return (
    <>
      {config.targetPositions.map((target, index) => {
        const targetPixel = coordinatesWorldToPixel(
          target,
          config.robot.originPosition,
        );
        const center = {
          x: (targetPixel.x + config.stage.margin.left) * pixelScale,
          y: (targetPixel.y + config.stage.margin.top) * pixelScale,
        };
        const rotationDeg = -(target.direction + 90);
        const rotationRad = (rotationDeg * Math.PI) / 180;

        const handleSelect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
          e.cancelBubble = true;
          send(
            buildPositionMessage(
              { x: target.x, y: target.y },
              target.direction,
            ),
          );
        };

        return (
          <Fragment key={`target-${index}`}>
            <Rect
              x={center.x}
              y={center.y}
              width={config.robot.size.width * pixelScale}
              height={config.robot.size.height * pixelScale}
              offsetX={config.robot.offset.x * pixelScale}
              offsetY={config.robot.offset.y * pixelScale}
              fill="rgba(255, 221, 0, 0.35)"
              stroke="yellow"
              rotation={rotationDeg}
              strokeWidth={5}
              onMouseDown={handleSelect}
              onTouchStart={handleSelect}
            />
            <Arrow
              points={[
                center.x,
                center.y,
                center.x + arrowLength * pixelScale * Math.cos(rotationRad),
                center.y + arrowLength * pixelScale * Math.sin(rotationRad),
              ]}
              stroke="yellow"
              strokeWidth={5}
              listening={false}
            />
          </Fragment>
        );
      })}

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
