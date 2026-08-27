import { useCallback } from 'react';
import { useCanvasStore } from '../../stores/useCanvasStore';
import { useWebSocketStore } from '../../stores/useWebSocketStore';
import { useControlStore } from '../../stores/useControlStore';
import type { WebSocketClient } from '../../services/websocketClient';
import type { PositionPayload } from '../../types/websocket';

/**
 * SendButtonコンポーネントのProps
 */
interface SendButtonProps {
  /** WebSocketClientインスタンスへのref（座標送信に使用） */
  wsClient: React.RefObject<WebSocketClient | null>;
}

/**
 * 選択した座標をWebSocket経由でロボットに送信するボタンコンポーネント。
 * 以下のすべてが揃った場合にのみ送信可能:
 * - WebSocket接続が確立されている
 * - キャンバス上で座標が選択されている
 * - 送信中でない
 *
 * @param props.wsClient - WebSocketClientインスタンスへのref
 */
export function SendButton({ wsClient }: SendButtonProps) {
  /** キャンバス上で選択された座標（未選択時はnull） */
  const selectedPoint = useCanvasStore((s) => s.selectedPoint);
  /** WebSocket接続状態 */
  const isConnected = useWebSocketStore((s) => s.isConnected);
  /** 送信中フラグと更新関数 */
  const { isSending, setIsSending } = useControlStore();

  /**
   * 座標送信ハンドラ。
   * 選択された座標をposition_updateメッセージとしてサーバーに送信する。
   * 送信中表示は300ms後に自動解除される。
   */
  const handleSend = useCallback(() => {
    if (!selectedPoint || !wsClient.current) return;

    setIsSending(true);

    const payload: PositionPayload = {
      target: 'robot-1',
      position: selectedPoint,
    };

    wsClient.current.send('position_update', payload);

    // 送信中表示を短時間で解除（UXフィードバック用）
    setTimeout(() => setIsSending(false), 300);
  }, [selectedPoint, wsClient, setIsSending]);

  /** ボタン無効化条件: 未接続 or 未選択 or 送信中 */
  const isDisabled = !isConnected || !selectedPoint || isSending;

  return (
    <button
      type="button"
      className="send-btn"
      onClick={handleSend}
      disabled={isDisabled}
    >
      {isSending ? '送信中...' : '座標を送信'}
    </button>
  );
}
