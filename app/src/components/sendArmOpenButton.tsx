import { buildCommandMessage } from "../utils/messageBuilder";
import { useWebSocketStore } from "../stores/useWebSocketStore";

export function SendArmOpenButton() {
  const send = useWebSocketStore((s) => s.send);

  const handleClick = () => {
    send(buildCommandMessage("arm_up"));
  };

  return (
    <button type="button" onClick={handleClick}>
      アームを開く
    </button>
  );
}
