import { getConfig } from "../config";
import { useCanvasStore } from "../stores/useCanvasStore";
import { useWebSocketStore } from "../stores/useWebSocketStore";

export function ToggleColorMode() {
  const { toggleColorMode, colorMode } = useCanvasStore();
  const { setRobotStatus } = useWebSocketStore();
  function handleClick() {
    toggleColorMode();
    setRobotStatus({
      position: { x: 0, y: 0 },
      direction: getConfig(colorMode).robot.direction,
      status: "idle",
    });
  }
  return (
    <button type="button" onClick={handleClick}>
      Color
    </button>
  );
}
