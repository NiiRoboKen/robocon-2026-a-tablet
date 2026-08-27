import { create } from "zustand";
import type { Point2D, Size2D, CanvasObject } from "../types/geometry";

/**
 * キャンバスストアの状態定義
 */
interface CanvasState {
  colorMode: "red" | "blue";
  realFieldSize: Size2D;
  pixelFieldSize: Size2D | null;
  pixelScale: number;
  /** キャンバス上に描画されるオブジェクトの一覧（WebSocket経由で同期） */
  objects: CanvasObject[];
  /** ユーザーがクリックで選択した座標点（未選択時はnull） */
  selectedPoint: Point2D | null;
  /** 現在のマウスカーソル位置（キャンバス外ではnull） */
  cursorPosition: Point2D | null;

  // Actions
  toggleColorMode: () => void;
  setPixelFieldSize: (size: Size2D) => void;
  setPixelScale: (scale: number) => void;

  /** オブジェクト一覧をサーバーから受信したデータで置き換える */
  setObjects: (objects: CanvasObject[]) => void;
  /** オブジェクトを1つ追加する */
  addObject: (obj: CanvasObject) => void;
  /** 指定IDのオブジェクトを削除する */
  removeObject: (id: string) => void;
  /** 選択座標を設定する（解除する場合はnullを渡す） */
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
  realFieldSize: { width: 6000, height: 10500 },
  pixelFieldSize: null,
  pixelScale: 1,

  objects: [],
  selectedPoint: null,
  cursorPosition: null,

  toggleColorMode: () =>
    set((s) => ({ colorMode: s.colorMode === "red" ? "blue" : "red" })),
  setPixelFieldSize: (size) => set({ pixelFieldSize: size }),
  setPixelScale: (scale) => set({ pixelScale: scale }),

  setObjects: (objects) => set({ objects }),
  addObject: (obj) => set((s) => ({ objects: [...s.objects, obj] })),
  removeObject: (id) =>
    set((s) => ({ objects: s.objects.filter((o) => o.id !== id) })),
  setSelectedPoint: (point) => set({ selectedPoint: point }),
  setCursorPosition: (point) => set({ cursorPosition: point }),
}));
