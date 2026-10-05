import { create } from "zustand";
import type { WsMessage } from "../types";
import type { InboundMessage } from "../types/websocket";
import type { WebSocketClient } from "../services/websocketClient";

interface WebSocketState {
  client: WebSocketClient | null;
  isConnected: boolean;
  lastMessage: InboundMessage | null;

  setClient: (client: WebSocketClient | null) => void;
  setConnected: (connected: boolean) => void;
  setLastMessage: (msg: InboundMessage) => void;
  /** 登録済みのクライアント経由でメッセージを送信する。未接続時は false を返す。 */
  send: (msg: WsMessage) => boolean;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  client: null,
  isConnected: false,
  lastMessage: null,

  setClient: (client) => set({ client }),
  setConnected: (connected) => set({ isConnected: connected }),
  setLastMessage: (msg) => set({ lastMessage: msg }),
  send: (msg) => {
    const client = get().client;
    if (!client || !client.isConnected) {
      console.warn("[WS] 未接続のため送信できません");
      return false;
    }
    client.send(msg);
    return true;
  },
}));
