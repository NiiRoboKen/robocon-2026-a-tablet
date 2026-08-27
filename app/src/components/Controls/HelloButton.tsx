import { useState } from 'react';
import { useWebSocketStore } from '../../stores/useWebSocketStore';
import type { WebSocketClient } from '../../services/websocketClient';

/**
 * HelloButtonコンポーネントのProps
 */
interface HelloButtonProps {
  /** WebSocketClientインスタンスへのref（メッセージ送信に使用） */
  wsClient: React.RefObject<WebSocketClient | null>;
}

/**
 * テスト用の「Hello」コマンド送信ボタン。
 * WebSocket経由でサーバーに'hello'コマンドを送信し、通信確認を行う。
 * 送信後2秒間「送信しました」のフィードバックを表示する。
 *
 * @param props.wsClient - WebSocketClientインスタンスへのref
 */
export function HelloButton({ wsClient }: HelloButtonProps) {
  /** WebSocket接続状態（未接続時はボタンを無効化） */
  const isConnected = useWebSocketStore((s) => s.isConnected);
  /** 送信完了フィードバック用のメッセージ（2秒後に消える） */
  const [lastAck, setLastAck] = useState<string | null>(null);

  /**
   * ボタンクリック時のハンドラ。
   * 'hello'コマンドをWebSocket経由で送信し、送信確認メッセージを表示する。
   */
  const handleClick = () => {
    if (!wsClient.current) return;

    wsClient.current.send('command', {
      command: 'hello',
      params: { message: 'Hello from frontend!' },
    });

    setLastAck('送信しました');
    setTimeout(() => setLastAck(null), 2000);
  };

  return (
    <div className="hello-button-container">
      <button
        type="button"
        className="hello-btn"
        onClick={handleClick}
        disabled={!isConnected}
      >
        Hello 送信
      </button>
      {/* 送信完了時のフィードバックメッセージ */}
      {lastAck && <span className="hello-ack">{lastAck}</span>}
    </div>
  );
}
