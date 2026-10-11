import { defaultBeltAcceleration } from "@/config";
import type { BeltAcceleration } from "@/types/config";
import { create } from "zustand";

export type TargetBeltObject =
  "bucket_low" | "bucket_middle" | "bucket_high" | "flag" | "table";

interface ControlState {
  isSending: boolean;

  targetBeltObject: TargetBeltObject;
  selectedBeltAcceleration: number;
  beltAccelerations: BeltAcceleration;
  selectedElevation: number;

  positionDelta: number;
  directionDelta: number;

  firstActionUsed: boolean;

  setIsSending: (sending: boolean) => void;

  setTargetBeltObject: (target: TargetBeltObject) => void;
  setSelectedBeltAcceleration: (a: number) => void;
  adjustSelectedBeltAcceleration: (delta: number) => void;
  setSelecredElevation: (e: number) => void;
  adjustSelectedElevation: (delta: number) => void;

  setPositionDelta: (delta: number) => void;
  setDirectionDelta: (delta: number) => void;
  adjustPositionDelta: (delta: number) => void;
  adjustDirectionDelta: (delta: number) => void;

  setFirstActionUsed: () => void;
}

export const useControlStore = create<ControlState>((set) => ({
  isSending: false,

  targetBeltObject: "bucket_low",
  selectedBeltAcceleration: defaultBeltAcceleration.bucket_low,
  beltAccelerations: { ...defaultBeltAcceleration },
  selectedElevation: 0,

  positionDelta: 5,
  directionDelta: 10,

  firstActionUsed: false,

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

  setSelectedBeltAcceleration: (a) => set({ selectedBeltAcceleration: a }),
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

  setSelecredElevation: (e) => set({ selectedElevation: e }),
  adjustSelectedElevation: (delta) =>
    set((state) => ({ selectedElevation: state.selectedElevation + delta })),

  setPositionDelta: (delta) => set({ positionDelta: delta }),
  setDirectionDelta: (delta) => set({ directionDelta: delta }),
  adjustPositionDelta: (delta) =>
    set((state) => ({ positionDelta: state.positionDelta + delta })),
  adjustDirectionDelta: (delta) =>
    set((state) => ({ directionDelta: state.directionDelta + delta })),

  setFirstActionUsed: () => set({ firstActionUsed: true }),
}));
