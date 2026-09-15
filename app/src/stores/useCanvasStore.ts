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
  /** ユーザーがクリックで選択した座標点（未選択時はnull） */
  selectedPoint: Point2D | null;
  /** 現在のマウスカーソル位置（キャンバス外ではnull） */
  cursorPosition: Point2D | null;

  // Actions
  toggleColorMode: () => void;
  setPixelFieldSize: (size: Size2D) => void;
  setPixelScale: (scale: number) => void;

  setSelectedPoint: (point: Point2D | null) => void;
  /** カーソル位置を更新する（キャンバス外に出た場合はnullを渡す） */
  setCursorPosition: (point: Point2D | null) => void;
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

  selectedPoint: null,
  cursorPosition: null,

  toggleColorMode: () =>
    set((s) => ({ colorMode: s.colorMode === "red" ? "blue" : "red" })),
  setPixelFieldSize: (size) => set({ pixelFieldSize: size }),
  setPixelScale: (scale) => set({ pixelScale: scale }),

  setSelectedPoint: (point) => set({ selectedPoint: point }),
  setCursorPosition: (point) => set({ cursorPosition: point }),
}));
