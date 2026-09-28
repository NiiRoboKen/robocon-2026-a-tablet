import { Arrow, Line } from "react-konva";
import { useCanvasStore } from "../../stores/useCanvasStore";
import type { Point2D } from "../../types";

/** 選択地点を示す赤い十字マーカー */
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
        stroke="red"
        strokeWidth={5}
      />
      <Line
        points={[position.x, position.y - size, position.x, position.y + size]}
        stroke="red"
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
 * ユーザー操作の視覚フィードバックを描画するレイヤー。
 * - selectedPoint: クリックで固定された地点を示す赤い十字マーカー
 * - cursorPosition: 現在のカーソル位置を示す座標ラベル
 *
 * 状態の更新は Stage 側の useCanvasInteraction が担当し、
 * このコンポーネントはストアの値を読み取って描画するだけにする。
 *   - クリック → selectedPoint が固定される（マーカーは動かない）
 *   - Konva領域外へマウスが出る → cursorPosition が null になり追従表示が消える
 */
export function InteractionLayer() {
  const { selectedPosition, selectedDirection } = useCanvasStore();

  return (
    <>
      {selectedPosition && (
        <CrosshairMarker
          position={selectedPosition}
          rotation={selectedDirection ?? 0}
        />
      )}
    </>
  );
}
