import { Arrow, Line } from "react-konva";
import { useCanvasStore } from "../../stores/useCanvasStore";
import type { Point2D } from "../../types";
import { useWebSocketStore } from "../../stores/useWebSocketStore";

/** 選択地点を示す赤い十字マーカー */
function CrosshairMarker({
  position,
  cursorDir,
  robotDir,
  robotColor,
}: {
  position: Point2D;
  cursorDir: number;
  robotDir: number;
  robotColor: "red" | "blue";
}) {
  const crossSize = 10;
  const arrowLineLength = 100;

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

      {/*ロボットの現在角度*/}
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

      {/*目標角度*/}
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
  const { colorMode, selectedPosition, cursorDirection } = useCanvasStore();
  const { robotStatus } = useWebSocketStore();

  const RobotDirection = robotStatus.direction;
  return (
    <>
      {selectedPosition && (
        <CrosshairMarker
          position={selectedPosition}
          cursorDir={cursorDirection}
          robotDir={RobotDirection}
          robotColor={colorMode}
        />
      )}
    </>
  );
}
