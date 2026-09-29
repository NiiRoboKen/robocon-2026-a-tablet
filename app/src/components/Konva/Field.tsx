import { Image, Line, Arrow } from "react-konva";
import useImage from "use-image";
import { useCanvasStore } from "../../stores/useCanvasStore";
import { getConfig } from "../../config";
import type { Point2D } from "../../types";

function CrosshairMarker({
  position,
  rotation,
  pixelScale,
}: {
  position: Point2D;
  rotation: number;
  pixelScale: number;
}) {
  const size = 100 * pixelScale;
  const ArrrowLength = 1000 * pixelScale;

  return (
    <>
      <Line
        points={[position.x - size, position.y, position.x + size, position.y]}
        stroke="yellow"
        strokeWidth={5}
      />
      <Line
        points={[position.x, position.y - size, position.x, position.y + size]}
        stroke="yellow"
        strokeWidth={5}
      />
      <Arrow
        points={[
          position.x,
          position.y,
          position.x + ArrrowLength * Math.cos(rotation),
          position.y - ArrrowLength * Math.sin(rotation),
        ]}
        stroke="Green"
        strokeWidth={5}
      />
    </>
  );
}

export function FieldLayer() {
  const { colorMode, pixelFieldSize, pixelScale } = useCanvasStore();

  const config = getConfig(colorMode);
  const worldOriginPoint = config.robot.originPosition;
  const pixelOriginPoint = {
    x: (worldOriginPoint.x + config.stage.margin.left) * pixelScale,
    y: (worldOriginPoint.y + config.stage.margin.top) * pixelScale,
  };

  const [image] = useImage(getConfig(colorMode).field.imagePath);

  return (
    <>
      <Image image={image} x={0} y={0} size={pixelFieldSize} />
      <CrosshairMarker
        position={pixelOriginPoint}
        rotation={((config.robot.direction + 90) * Math.PI) / 180}
        pixelScale={pixelScale}
      />
    </>
  );
}
