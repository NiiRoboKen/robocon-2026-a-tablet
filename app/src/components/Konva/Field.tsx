import { Image, Line, Arrow } from "react-konva";
import useImage from "use-image";
import { useCanvasStore } from "../../stores/useCanvasStore";
import { getConfig } from "../../config";
import type { Point2D } from "../../types";
import { worldToPixel } from "../../utils/coordinate";

function CrosshairMarker({
  position,
  rotation,
}: {
  position: Point2D;
  rotation: number;
}) {
  const size = 10;

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
          position.x + 20 * Math.cos((rotation * Math.PI) / 180),
          position.y + 20 * Math.sin((rotation * Math.PI) / 180),
        ]}
        stroke="Green"
      />
    </>
  );
}

/**
 * キャンバス上に背景画像を描画するレイヤーコンポーネント。
 * listening={false}のLayerに配置することでイベント処理を省略し、パフォーマンスを向上させる。
 */
export function FieldLayer() {
  const { colorMode, pixelFieldSize, pixelScale } = useCanvasStore();

  const rotation = getConfig(colorMode).robot.direction;
  const worldOriginPoint = getConfig(colorMode).robot.originPosition;
  const pixelOriginPoint = worldToPixel(worldOriginPoint, pixelScale);

  const [image] = useImage(getConfig(colorMode).field.imagePath);

  return (
    <>
      <Image image={image} x={0} y={0} size={pixelFieldSize} />
      <CrosshairMarker position={pixelOriginPoint} rotation={rotation} />
    </>
  );
}
