import { useCanvasStore } from '../../stores/useCanvasStore';

/**
 * 現在のカーソル座標と選択座標をリアルタイム表示するコンポーネント。
 * キャンバスの下部やサイドに配置し、ユーザーに座標情報のフィードバックを提供する。
 *
 * - カーソル座標: マウスが移動するたびに更新される現在位置
 * - 選択座標: 'point'モードでクリックした地点（ロボットへの送信対象）
 */
export function CoordinateDisplay() {
  /** 現在のカーソル位置（キャンバス外ではnull） */
  const cursorPosition = useCanvasStore((s) => s.cursorPosition);
  /** ユーザーが選択した座標（未選択時はnull） */
  const selectedPoint = useCanvasStore((s) => s.selectedPoint);

  return (
    <div className="coordinate-display">
      {/* カーソル位置のリアルタイム表示 */}
      <div className="coord-item">
        <span className="coord-label">カーソル:</span>
        <span className="coord-value">
          {cursorPosition
            ? `(${Math.round(cursorPosition.x)}, ${Math.round(cursorPosition.y)})`
            : '---'}
        </span>
      </div>
      {/* クリックで選択した座標の表示 */}
      <div className="coord-item">
        <span className="coord-label">選択座標:</span>
        <span className="coord-value">
          {selectedPoint
            ? `(${Math.round(selectedPoint.x)}, ${Math.round(selectedPoint.y)})`
            : '未選択'}
        </span>
      </div>
    </div>
  );
}
