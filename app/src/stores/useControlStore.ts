import { create } from 'zustand';

interface ControlState {
  isSending: boolean;
  setIsSending: (sending: boolean) => void;
}

export const useControlStore = create<ControlState>((set) => ({
  isSending: false,

  setIsSending: (sending) => set({ isSending: sending }),
}));
