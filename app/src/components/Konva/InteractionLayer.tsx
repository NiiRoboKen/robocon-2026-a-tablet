import { Arrow, Line, Text } from "react-konva";
import { useCanvasStore } from "../../stores/useCanvasStore";
import type { Point2D } from "../../types";
import { useWebSocketStore } from "../../stores/useWebSocketStore";

/** 座標ラベル（カーソルの現在位置をワールド座標でテキスト表示） */
function CoordinateLabel({
  position,
  direction,
  pixelScale,
}: {
  position: Point2D;
  direction: number;
  pixelScale: number;
}) {
  const worldX = Math.round(position.x / pixelScale);
  const worldY = Math.round(position.y / pixelScale);

  return (
    <Text
      text={`x:${worldX}, y:${worldY}, rotation:${direction}`}
      x={0}
      y={0}
    />
  );
}

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
  const { selectedPosition, cursorPosition, pixelScale, selectedDirection} = useCanvasStore();

  return (
    <>
      {cursorPosition && (
        <CoordinateLabel
          position={cursorPosition}
          direction={useWebSocketStore.getState().robotStatus.direction}
          pixelScale={pixelScale}
        />
      )}

      {selectedPosition && (
        <CrosshairMarker
          position={selectedPosition}
          rotation={selectedDirection ?? 0}
        />
      )}
    </>
  );
}
