import { create } from "zustand";
import type { Point2D, Size2D } from "../types/geometry";
import type { ColorMode } from "../types/config";
import { getConfig } from "../config";

const config = getConfig("red");

interface CanvasState {
  colorMode: ColorMode;
  pixelFieldSize: Size2D | null;
  pixelScale: number;
  pixelRatio: number;
  selectedPosition: Point2D | null;
  cursorPosition: Point2D | null;
  selectedDirection: number;
  cursorDirection: number;
  isMouseDown: boolean;

  toggleColorMode: () => void;
  setPixelFieldSize: (size: Size2D | null) => void;
  setPixelScale: (scale: number) => void;
  setPixelRatio: (ratio: number) => void;

  setSelectedPosition: (point: Point2D | null) => void;
  setCursorPosition: (point: Point2D | null) => void;
  setSelectedDirection: (dir: number) => void;
  setCursorDirection: (dir: number) => void;

  setIsMouseDown: (m: boolean) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  colorMode: "red",
  pixelFieldSize: null,
  pixelScale: 1,
  pixelRatio: 1,

  selectedPosition: null,
  cursorPosition: null,
  selectedDirection: config.robot.direction,
  cursorDirection: config.robot.direction,

  isMouseDown: false,

  toggleColorMode: () =>
    set((s) => ({ colorMode: s.colorMode === "red" ? "blue" : "red" })),
  setPixelFieldSize: (size) => set({ pixelFieldSize: size }),
  setPixelScale: (scale) => set({ pixelScale: scale }),
  setPixelRatio: (ratio) => set({ pixelRatio: ratio }),

  setSelectedPosition: (point) => set({ selectedPosition: point }),
  setCursorPosition: (point) => set({ cursorPosition: point }),

  setSelectedDirection: (dir) => set({ selectedDirection: dir }),
  setCursorDirection: (dir) => set({ cursorDirection: dir }),

  setIsMouseDown: (m) => set({ isMouseDown: m }),
}));
