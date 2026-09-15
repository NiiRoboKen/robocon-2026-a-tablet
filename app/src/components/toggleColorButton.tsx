import { useCanvasStore } from "../stores/useCanvasStore";

export function ToggleColorMode() {
  const { toggleColorMode } = useCanvasStore();
  return (
    <button type="button" onClick={toggleColorMode}>
      Color
    </button>
  );
}
