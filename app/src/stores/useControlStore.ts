import { defaultBeltAcceleration } from "@/config";
import type { BeltAcceleration } from "@/types/config";
import { create } from "zustand";

export type TargetBeltObject = "fix1" | "fix2" | "fix3" | "table";

interface ControlState {
  isSending: boolean;

  targetBeltObject: TargetBeltObject;
  selectedBeltAcceleration: number;
  beltAccelerations: BeltAcceleration;

  setIsSending: (sending: boolean) => void;

  setTargetBeltObject: (target: TargetBeltObject) => void;

  setSelectedBeltAcceleration: (a: number) => void;
  adjustSelectedBeltAcceleration: (delta: number) => void;

  setBeltAcceleration: (key: TargetBeltObject, a: number) => void;
}

export const useControlStore = create<ControlState>((set) => ({
  isSending: false,

  targetBeltObject: "fix1",
  selectedBeltAcceleration: defaultBeltAcceleration.fix1,
  beltAccelerations: { ...defaultBeltAcceleration },

  setIsSending: (sending) => set({ isSending: sending }),

  setTargetBeltObject: (target) =>
    set((state) => {
      const updated: BeltAcceleration = {
        ...state.beltAccelerations,
        [state.targetBeltObject]: state.selectedBeltAcceleration,
      };
      return {
        beltAccelerations: updated,
        targetBeltAcceleration: target,
        selectedBeltAcceleration: updated[target],
      };
    }),

  setSelectedBeltAcceleration: (a) =>
    set((state) => ({
      selectedBeltAcceleration: a,
      beltAccelerations: {
        ...state.beltAccelerations,
        [state.targetBeltObject]: a,
      },
    })),

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

  setBeltAcceleration: (key, a) =>
    set((state) => ({
      beltAccelerations: {
        ...state.beltAccelerations,
        [key]: a,
      },
      selectedBeltAcceleration:
        key === state.targetBeltObject
          ? a
          : state.selectedBeltAcceleration,
    })),
}));
