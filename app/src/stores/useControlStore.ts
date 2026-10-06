import { create } from "zustand";

interface ControlState {
  isSending: boolean;
  acceleration: number;

  setIsSending: (sending: boolean) => void;
  setAcceleration: (a: number) => void;
  adjustAcceleration: (a: number) => void;
}

export const useControlStore = create<ControlState>((set) => ({
  isSending: false,
  acceleration: 0,

  setIsSending: (sending) => set({ isSending: sending }),
  setAcceleration: (a) => set({ acceleration: a }),
  adjustAcceleration: (a) =>
    set((state) => ({ acceleration: state.acceleration + a })),
}));
