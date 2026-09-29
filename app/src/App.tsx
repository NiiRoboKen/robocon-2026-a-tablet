import { useWebSocket } from "./hooks/useWebSocket";
import { SendArmOpenButton } from "./components/sendArmOpenButton";
import { Konva } from "./components/Konva";
import { ToggleColorMode } from "./components/toggleColorButton";
import "./App.css";
import { SendPositionButton } from "./components/sendPositionButton";
import { SelectedInfoLabel } from "./components/selectedInfoLabel";
import { CursorInfoLabel } from "./components/cursorInfoLabel";

function App() {
  const wsClient = useWebSocket();

  return (
    <div className="app-container">
      <main>
        <ToggleColorMode />
        <SelectedInfoLabel />
        <CursorInfoLabel />
        <Konva />
        <SendArmOpenButton wsClient={wsClient} />
        <SendPositionButton wsClient={wsClient} />
      </main>
    </div>
  );
}

export default App;
