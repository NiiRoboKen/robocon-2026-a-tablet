import { Circle, Line, Text } from 'react-konva';
import { useCanvasStore } from '../../stores/useCanvasStore';

/**
 * ユーザー操作の視覚フィードバックを描画するレイヤーコンポーネント。
 * - 選択座標: 赤いマーカー（円+十字線+座標テキスト）
 * - カーソル位置: 薄いクロスヘア
 *
 * 'point'モードでクリックした地点にマーカーを表示し、
 * ロボットへの座標送信対象を視覚的に示す。
 */
export function InteractionLayer() {
  /** ユーザーがクリックで選択した座標（未選択時はnull） */
  const selectedPoint = useCanvasStore((s) => s.selectedPoint);
  /** 現在のカーソル位置（キャンバス外ではnull） */
  const cursorPosition = useCanvasStore((s) => s.cursorPosition);

  return (
    <>
      {/* 選択された座標のマーカー（赤い円+十字線+座標ラベル） */}
      {selectedPoint && (
        <>
          {/* 選択地点を示す赤い円 */}
          <Circle
            x={selectedPoint.x}
            y={selectedPoint.y}
            radius={6}
            fill="#e74c3c"
            stroke="#c0392b"
            strokeWidth={2}
          />
          {/* 水平方向の十字線 */}
          <Line
            points={[
              selectedPoint.x - 12,
              selectedPoint.y,
              selectedPoint.x + 12,
              selectedPoint.y,
            ]}
            stroke="#e74c3c"
            strokeWidth={1}
          />
          {/* 垂直方向の十字線 */}
          <Line
            points={[
              selectedPoint.x,
              selectedPoint.y - 12,
              selectedPoint.x,
              selectedPoint.y + 12,
            ]}
            stroke="#e74c3c"
            strokeWidth={1}
          />
          {/* 選択座標のテキスト表示 */}
          <Text
            x={selectedPoint.x + 10}
            y={selectedPoint.y - 20}
            text={`(${Math.round(selectedPoint.x)}, ${Math.round(selectedPoint.y)})`}
            fontSize={12}
            fill="#e74c3c"
          />
        </>
      )}

      {/* カーソル位置のクロスヘア（半透明、軽量表示） */}
      {cursorPosition && (
        <>
          <Line
            points={[
              cursorPosition.x - 8,
              cursorPosition.y,
              cursorPosition.x + 8,
              cursorPosition.y,
            ]}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth={1}
          />
          <Line
            points={[
              cursorPosition.x,
              cursorPosition.y - 8,
              cursorPosition.x,
              cursorPosition.y + 8,
            ]}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth={1}
          />
        </>
      )}
    </>
  );
}
