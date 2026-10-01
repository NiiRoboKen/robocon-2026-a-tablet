import { create } from "zustand";
import type { WsMessage, RobotStatus } from "../types";
import type { RobotStatePayload, InboundMessage } from "../types/websocket";
import { getConfig } from "../config";
import { useCanvasStore } from "./useCanvasStore";
import type { WebSocketClient } from "../services/websocketClient";

const config = getConfig(useCanvasStore.getState().colorMode);

interface WebSocketState {
  client: WebSocketClient | null;
  isConnected: boolean;
  lastMessage: InboundMessage | null;
  robotStatus: RobotStatus;
  /** ESP → tablet の robot_state 受信ペイロード。未受信時は null。 */
  robotState: RobotStatePayload | null;

  setClient: (client: WebSocketClient | null) => void;
  setConnected: (connected: boolean) => void;
  setLastMessage: (msg: InboundMessage) => void;
  setRobotStatus: (status: RobotStatus) => void;
  setRobotState: (state: RobotStatePayload) => void;
  /** 登録済みのクライアント経由でメッセージを送信する。未接続時は false を返す。 */
  send: (msg: WsMessage) => boolean;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  client: null,
  isConnected: false,
  lastMessage: null,
  robotStatus: {
    position: { x: 0, y: 0 },
    direction: config.robot.direction,
    status: null,
  },
  robotState: null,

  setClient: (client) => set({ client }),
  setConnected: (connected) => set({ isConnected: connected }),
  setLastMessage: (msg) => set({ lastMessage: msg }),
  setRobotStatus: (status) => set({ robotStatus: status }),
  setRobotState: (state) => set({ robotState: state }),
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
