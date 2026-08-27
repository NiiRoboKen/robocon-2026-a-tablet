import { useWebSocket } from "./hooks/useWebSocket";
import { SendAemOpenButton } from "./components/sendAemOpenButton";
import { KonvaCanvas } from "./components/Canvas/KonvaCanvas";
// import { ControlPanel } from './components/Controls/ControlPanel';
// import { CoordinateDisplay } from './components/common/CoordinateDisplay';
import "./App.css";

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
      <main>
        <KonvaCanvas />
        <SendAemOpenButton wsClient={wsClient} />
      </main>
    </div>
  );
}

export default App;
