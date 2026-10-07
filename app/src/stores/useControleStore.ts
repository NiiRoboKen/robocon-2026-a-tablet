import { defaultBeltAcceleration } from "@/config";
import type { BeltAcceleration } from "@/types/config";
import { create } from "zustand";

export type TargetBeltObject = "fix1" | "fix2" | "fix3" | "table";

interface ControlState {
  isSending: boolean;

  targetBeltObject: TargetBeltObject;
  selectedBeltAcceleration: number;
  beltAccelerations: BeltAcceleration;

  positionDelta: number;
  directionDelta: number;

  setIsSending: (sending: boolean) => void;

  setTargetBeltObject: (target: TargetBeltObject) => void;
  adjustSelectedBeltAcceleration: (delta: number) => void;

  setPositionDelta: (delta: number) => void;
  setDirectionDelta: (delta: number) => void;
  adjustPositionDelta: (delta: number) => void;
  adjustDirectionDelta: (delta: number) => void;
}

export const useControlStore = create<ControlState>((set) => ({
  isSending: false,

  targetBeltObject: "fix1",
  selectedBeltAcceleration: defaultBeltAcceleration.fix1,
  beltAccelerations: { ...defaultBeltAcceleration },

  positionDelta: 5,
  directionDelta: 10,

  setIsSending: (sending) => set({ isSending: sending }),

  setTargetBeltObject: (target) =>
    set((state) => {
      const updated: BeltAcceleration = {
        ...state.beltAccelerations,
        [state.targetBeltObject]: state.selectedBeltAcceleration,
      };
      return {
        beltAccelerations: updated,
        targetBeltObject: target,
        selectedBeltAcceleration: updated[target],
      };
    }),

  adjustSelectedBeltAcceleration: (delta) =>
    set((state) => {
      const next = state.selectedBeltAcceleration + delta;
      return {
        selectedBeltAcceleration: next,
        beltAccelerations: {
          ...state.beltAccelerations,
          [state.targetBeltObject]: next,
        },
      };
    }),

  setPositionDelta: (delta) => set({ positionDelta: delta }),
  setDirectionDelta: (delta) => set({ directionDelta: delta }),
  adjustPositionDelta: (delta) =>
    set((state) => ({ positionDelta: state.positionDelta + delta })),
  adjustDirectionDelta: (delta) =>
    set((state) => ({ directionDelta: state.directionDelta + delta })),
}));
