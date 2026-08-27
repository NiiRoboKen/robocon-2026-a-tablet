import type { RefObject } from "react";
import type { WebSocketClient } from "../services/websocketClient";

interface SendAemOpenButtonProps {
  /** WebSocketClientインスタンスへのref */
  wsClient: RefObject<WebSocketClient | null>;
}

/**
 * アームを開くコマンドをWebSocket経由で送信するボタンコンポーネント。
 * クリック時に 'arm_open' コマンドをサーバーに送信する。
 */
export function SendAemOpenButton({ wsClient }: SendAemOpenButtonProps) {
  const handleClick = () => {
    const client = wsClient.current;
    if (!client) {
      console.warn("[SendAemOpenButton] WebSocket未接続");
      return;
    }
    client.send("command", { command: "arm_open" });
  };

  return (
    <button type="button" onClick={handleClick}>
      アームを開く
    </button>
  );
}
