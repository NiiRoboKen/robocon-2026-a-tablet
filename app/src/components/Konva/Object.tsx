import { Rect, Circle, Arrow } from "react-konva";
import { useCanvasStore } from "../../stores/useCanvasStore";
import { getConfig } from "../../config";
import { useRobotStore } from "../../stores/useRobotStore";
import { coordinatesWorldToPixel } from "../../utils/coordinate";

export function ObjectLayer() {
  const { colorMode, pixelScale } = useCanvasStore();
  const config = getConfig(colorMode);
  const { position } = useRobotStore();

  const robotPositionPixel = coordinatesWorldToPixel(
    position,
    config.robot.originPosition,
  );
  const robotCenter = {
    x: (robotPositionPixel.x + config.stage.margin.left) * pixelScale,
    y: (robotPositionPixel.y + config.stage.margin.top) * pixelScale,
  };
  const rotationDeg = -(position.direction + 90);
  const rotationRad = (rotationDeg * Math.PI) / 180;
  const arrowLength = 1000; // 実世界mm

  return (
    <>
      <Rect
        x={robotCenter.x}
        y={robotCenter.y}
        width={config.robot.size.width * pixelScale}
        height={config.robot.size.height * pixelScale}
        offsetX={config.robot.offset.x * pixelScale}
        offsetY={config.robot.offset.y * pixelScale}
        fill="green"
        stroke="black"
        rotation={rotationDeg}
        strokeWidth={5}
      />
      <Circle x={robotCenter.x} y={robotCenter.y} radius={10} fill="blue" />
      <Arrow
        points={[
          robotCenter.x,
          robotCenter.y,
          robotCenter.x + arrowLength * pixelScale * Math.cos(rotationRad),
          robotCenter.y + arrowLength * pixelScale * Math.sin(rotationRad),
        ]}
        stroke={colorMode}
        strokeWidth={5}
      />

      {/*{config.obstacles.map((obstacle, index) => {
        if (obstacle.shape === "rect") {
          return (
            <Rect
              key={`obstacle-rect-${index}`}
              x={(obstacle.position.x - obstacle.size.width / 2 ) * pixelScale}
              y={(obstacle.position.y - obstacle.size.height / 2) * pixelScale}
              width={obstacle.size.width * pixelScale}
              height={obstacle.size.height * pixelScale}
              rotation={obstacle.direction ?? 0}
              fill="gray"
              stroke="black"
              strokeWidth={3}
            />
          );
        }

        return (
          <Circle
            key={`obstacle-circle-${index}`}
            x={obstacle.position.x * pixelScale}
            y={obstacle.position.y * pixelScale}
            radius={obstacle.radius * pixelScale}
            fill="gray"
            stroke="black"
            strokeWidth={3}
          />
        );
      })}*/}
    </>
  );
}
