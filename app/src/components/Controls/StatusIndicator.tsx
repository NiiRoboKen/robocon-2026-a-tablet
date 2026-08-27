import { useWebSocketStore } from '../../stores/useWebSocketStore';

/**
 * WebSocket接続状態を視覚的に表示するインジケータコンポーネント。
 * 接続中は緑色のドット+「接続中」、未接続時は赤色のドット+「未接続」を表示する。
 */
export function StatusIndicator() {
  /** WebSocket接続状態を取得 */
  const isConnected = useWebSocketStore((s) => s.isConnected);

  return (
    <div className="status-indicator">
      {/* 接続状態を色で示すドット（緑=接続、赤=未接続） */}
      <span
        className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}
      />
      <span className="status-text">
        {isConnected ? '接続中' : '未接続'}
      </span>
    </div>
  );
}
