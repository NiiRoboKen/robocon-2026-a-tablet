import { create } from "zustand";
import type { Point2D, Size2D } from "../types/geometry";
import type { ColorMode } from "../types/config";
import { getConfig } from "../config";

const config = getConfig("red");

/**
 * キャンバスストアの状態定義
 */
interface CanvasState {
  colorMode: ColorMode;
  pixelFieldSize: Size2D;
  pixelScale: number;
  selectedPosition: Point2D | null;
  cursorPosition: Point2D | null;
  selectedDirection: number | null;
  cursorDirection: number | null;

  // Actions
  toggleColorMode: () => void;
  setPixelFieldSize: (size: Size2D) => void;
  setPixelScale: (scale: number) => void;

  setSelectedPosition: (point: Point2D | null) => void;
  /** カーソル位置を更新する（キャンバス外に出た場合はnullを渡す） */
  setCursorPosition: (point: Point2D | null) => void;
  setSelectedDirection: (dir: number | null) => void;
  setCursorDirection: (dir: number | null) => void;
}

/**
 * キャンバスの描画状態を管理するZustandストア。
 * フィールドマップ上のオブジェクト群と、ユーザーの座標選択・カーソル位置を保持する。
 * WebSocketで受信したオブジェクトデータはこのストア経由で描画レイヤーに反映される。
 *
 * @example
 * ```ts
 * const { objects, setSelectedPoint } = useCanvasStore();
 * setSelectedPoint({ x: 100, y: 200 }); // 座標を選択
 * ```
 */
export const useCanvasStore = create<CanvasState>((set) => ({
  colorMode: "red",
  pixelFieldSize: config.field.size,
  pixelScale: 1,

  selectedPosition: null,
  cursorPosition: null,
  selectedDirection: 0,
  cursorDirection: null,

  toggleColorMode: () =>
    set((s) => ({ colorMode: s.colorMode === "red" ? "blue" : "red" })),
  setPixelFieldSize: (size) => set({ pixelFieldSize: size }),
  setPixelScale: (scale) => set({ pixelScale: scale }),

  setSelectedPosition: (point) => set({ selectedPosition: point }),
  setCursorPosition: (point) => set({ cursorPosition: point }),

  setSelectedDirection: (dir) => set({ selectedDirection: dir }),
  setCursorDirection: (dir) => set({ cursorDirection: dir }),
}));
