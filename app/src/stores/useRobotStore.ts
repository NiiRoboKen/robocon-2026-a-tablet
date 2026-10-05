import { create } from "zustand";
import type { RobotStatus } from "../types";
import type { RobotStatePayload } from "../types/websocket";
import { getConfig } from "../config";
import { useCanvasStore } from "./useCanvasStore";

const config = getConfig(useCanvasStore.getState().colorMode);

interface RobotState {
  robotStatus: RobotStatus;
  robotState: RobotStatePayload | null;

  isControllerMode: boolean;
  isFloorHarvest: boolean;

  setRobotStatus: (status: RobotStatus) => void;
  setRobotState: (state: RobotStatePayload) => void;

  setIsControllerMode: (c: boolean) => void;
  setIsFloorHarvest: (f: boolean) => void;
}

export const useRobotStore = create<RobotState>((set) => ({
  robotStatus: {
    position: { x: 0, y: 0 },
    direction: config.robot.direction,
  },
  robotState: null,

  isControllerMode: false,
  isFloorHarvest: false,

  setRobotStatus: (status) => set({ robotStatus: status }),
  setRobotState: (state) => set({ robotState: state }),

  setIsControllerMode: (c) => set({ isControllerMode: c }),
  setIsFloorHarvest: (f) => set({ isFloorHarvest: f }),
}));
