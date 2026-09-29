import { create } from "zustand";
import type { Point2D, Size2D } from "../types/geometry";
import type { ColorMode } from "../types/config";
import { getConfig } from "../config";

const config = getConfig("red");

interface CanvasState {
  colorMode: ColorMode;
  pixelFieldSize: Size2D;
  pixelScale: number;
  selectedPosition: Point2D | null;
  cursorPosition: Point2D | null;
  selectedDirection: number;
  cursorDirection: number;

  toggleColorMode: () => void;
  setPixelFieldSize: (size: Size2D) => void;
  setPixelScale: (scale: number) => void;

  setSelectedPosition: (point: Point2D | null) => void;
  setCursorPosition: (point: Point2D | null) => void;
  setSelectedDirection: (dir: number) => void;
  setCursorDirection: (dir: number) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  colorMode: "red",
  pixelFieldSize: config.field.size,
  pixelScale: 1,

  selectedPosition: null,
  cursorPosition: null,
  selectedDirection: config.robot.direction,
  cursorDirection: config.robot.direction,

  toggleColorMode: () =>
    set((s) => ({ colorMode: s.colorMode === "red" ? "blue" : "red" })),
  setPixelFieldSize: (size) => set({ pixelFieldSize: size }),
  setPixelScale: (scale) => set({ pixelScale: scale }),

  setSelectedPosition: (point) => set({ selectedPosition: point }),
  setCursorPosition: (point) => set({ cursorPosition: point }),

  setSelectedDirection: (dir) => set({ selectedDirection: dir }),
  setCursorDirection: (dir) => set({ cursorDirection: dir }),
}));
