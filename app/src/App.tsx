import { useWebSocket } from "./hooks/useWebSocket";
import { Konva } from "./components/Konva";
import { ToggleColorMode } from "./components/toggleColorButton";
import "./App.css";
import { SendPositionButton } from "./components/sendPositionButton";
import { SelectedInfoLabel } from "./components/selectedInfoLabel";
import { CursorInfoLabel } from "./components/cursorInfoLabel";

function App() {
  useWebSocket();

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
          <SendPositionButton />
        </section>
      </main>
    </div>
  );
}

export default App;
