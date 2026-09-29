import type { RefObject } from "react";
import type { WebSocketClient } from "../services/websocketClient";
import { buildCommandMessage } from "../utils/messageBuilder";

interface SendAemOpenButtonProps {
  wsClient: RefObject<WebSocketClient | null>;
}

export function SendArmOpenButton({ wsClient }: SendAemOpenButtonProps) {
  const handleClick = () => {
    const client = wsClient.current;
    if (!client) {
      console.warn("[SendAemOpenButton] WebSocket未接続");
      return;
    }
    client.send(buildCommandMessage("arm_up"));
  };

  return (
    <button type="button" onClick={handleClick}>
      アームを開く
    </button>
  );
}
