import { create } from "zustand";
import type { WsMessage, RobotStatus } from "../types";
import { getConfig } from "../config";
import { useCanvasStore } from "./useCanvasStore";

const config = getConfig(useCanvasStore.getState().colorMode);

interface WebSocketState {
  isConnected: boolean;
  lastMessage: WsMessage | null;
  robotStatus: RobotStatus;

  setConnected: (connected: boolean) => void;
  setLastMessage: (msg: WsMessage) => void;
  setRobotStatus: (status: RobotStatus) => void;
}

export const useWebSocketStore = create<WebSocketState>((set) => ({
  isConnected: false,
  lastMessage: null,
  robotStatus: {
    position: { x: 0, y: 0 },
    direction: config.robot.direction,
    status: null,
  },

  setConnected: (connected) => set({ isConnected: connected }),
  setLastMessage: (msg) => set({ lastMessage: msg }),
  setRobotStatus: (status) => set({ robotStatus: status }),
}));
