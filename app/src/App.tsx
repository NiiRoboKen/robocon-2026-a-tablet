import { useWebSocket } from "./hooks/useWebSocket";
import { Konva } from "./components/Konva";
import { ToggleColorMode } from "./components/toggleColorButton";
import "./App.css";
import { SendPositionButton } from "./components/sendPositionButton";
import { SelectedInfoLabel } from "./components/selectedInfoLabel";
import { CursorInfoLabel } from "./components/cursorInfoLabel";

/**
 * アプリケーションのルートコンポーネント。
 * Robocon 2026 コントローラーの全体レイアウトを構成する。
 *
 * 主な責務:
 * - WebSocket接続の初期化（useWebSocketフック経由）
 * - 子コンポーネント（キャンバス、操作パネル、座標表示）の配置
 * - WebSocketClientのrefを子コンポーネントに配布
 */
function App() {
  /** WebSocket接続を確立し、サーバーとのリアルタイム通信を管理するref */
  const wsClient = useWebSocket();

  return (
    <div className="app-container">
      <main className="app-main">
        <section className="left-pane">
          <ToggleColorMode />
          <Konva />
        </section>
        <section className="right-pane">
          <SelectedInfoLabel />
          <CursorInfoLabel />
          <SendPositionButton wsClient={wsClient} />
        </section>
      </main>
    </div>
  );
}

export default App;
