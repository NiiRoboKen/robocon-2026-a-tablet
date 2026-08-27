import { Image } from "react-konva";
import useImage from "use-image";
import { useCanvasStore } from "../../stores/useCanvasStore";


/**
 * キャンバス上に背景画像を描画するレイヤーコンポーネント。
 * listening={false}のLayerに配置することでイベント処理を省略し、パフォーマンスを向上させる。
 */

export function FieldLayer() {
  const { colorMode, pixelFieldSize } = useCanvasStore();
  const [image] = useImage(
    colorMode === "blue" ? "/fieldBlueImage.png" : "/fieldRedImage.png",
  );
  return <Image image={image} x={0} y={0} size={pixelFieldSize} />;
}
