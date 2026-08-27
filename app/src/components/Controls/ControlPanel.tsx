import { SendButton } from './SendButton';
import { HelloButton } from './HelloButton';
import { StatusIndicator } from './StatusIndicator';
import { useControlStore } from '../../stores/useControlStore';
import type { InteractionMode } from '../../stores/useControlStore';
import type { WebSocketClient } from '../../services/websocketClient';

/**
 * ControlPanelコンポーネントのProps
 */
interface ControlPanelProps {
  /** WebSocketClientインスタンスへのref（送信ボタンで使用） */
  wsClient: React.RefObject<WebSocketClient | null>;
}

/**
 * 操作モードの定義一覧。
 * ボタンとして表示され、クリックで切り替えられる。
 */
const MODES: { value: InteractionMode; label: string }[] = [
  { value: 'select', label: '選択' },
  { value: 'point', label: '座標指定' },
  { value: 'measure', label: '計測' },
];

/**
 * 操作パネルコンポーネント。
 * モード切替ボタン・座標送信ボタン・WebSocket接続状態表示を統合的に配置する。
 * 画面右側のサイドパネルとして使用される。
 *
 * @param props.wsClient - WebSocketClientインスタンスへのref
 */
export function ControlPanel({ wsClient }: ControlPanelProps) {
  const { mode, setMode } = useControlStore();

  return (
    <div className="control-panel">
      {/* WebSocket接続状態の表示 */}
      <StatusIndicator />

      {/* モード切替セクション */}
      <div className="control-section">
        <h3>モード</h3>
        <div className="mode-buttons">
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              className={`mode-btn ${mode === m.value ? 'active' : ''}`}
              onClick={() => setMode(m.value)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 送信操作セクション */}
      <div className="control-section">
        <h3>送信</h3>
        <SendButton wsClient={wsClient} />
        <HelloButton wsClient={wsClient} />
      </div>
    </div>
  );
}
