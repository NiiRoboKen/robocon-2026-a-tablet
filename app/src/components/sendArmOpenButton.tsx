import type { RefObject } from "react";
import type { WebSocketClient } from "../services/websocketClient";
import { buildCommandMessage } from "../utils/messageBuilder";

interface SendAemOpenButtonProps {
  /** WebSocketClientインスタンスへのref */
  wsClient: RefObject<WebSocketClient | null>;
}

/**
 * アームを開くコマンドをWebSocket経由で送信するボタンコンポーネント。
 * クリック時に 'arm_open' コマンドをサーバーに送信する。
 */
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
