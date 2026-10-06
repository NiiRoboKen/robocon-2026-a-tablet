import { create } from "zustand";
import type { RobotStatePayload, PositionPayload } from "../types/websocket";
interface RobotState {
  position: PositionPayload;
  robotState: RobotStatePayload | null;

  isControllerMode: boolean;
  isFloorHarvest: boolean;

  setPosition: (position: PositionPayload) => void;
  setRobotState: (state: RobotStatePayload) => void;

  setIsControllerMode: (c: boolean) => void;
  setIsFloorHarvest: (f: boolean) => void;
}

export const useRobotStore = create<RobotState>((set) => ({
  position: { x: 0, y: 0, direction: 0 },
  robotState: null,

  isControllerMode: false,
  isFloorHarvest: false,

  setPosition: (position) => set({ position: position }),
  setRobotState: (state) => set({ robotState: state }),

  setIsControllerMode: (c) => set({ isControllerMode: c }),
  setIsFloorHarvest: (f) => set({ isFloorHarvest: f }),
}));
