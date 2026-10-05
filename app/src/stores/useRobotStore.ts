import { create } from "zustand";
import type { RobotStatus } from "../types";
import type { RobotStatePayload } from "../types/websocket";
import { getConfig } from "../config";
import { useCanvasStore } from "./useCanvasStore";

const config = getConfig(useCanvasStore.getState().colorMode);

interface RobotState {
  robotStatus: RobotStatus;
  robotState: RobotStatePayload | null;

  setRobotStatus: (status: RobotStatus) => void;
  setRobotState: (state: RobotStatePayload) => void;
}

export const useRobotStore = create<RobotState>((set) => ({
  robotStatus: {
    position: { x: 0, y: 0 },
    direction: config.robot.direction,
    status: null,
  },
  robotState: null,

  setRobotStatus: (status) => set({ robotStatus: status }),
  setRobotState: (state) => set({ robotState: state }),
}));
