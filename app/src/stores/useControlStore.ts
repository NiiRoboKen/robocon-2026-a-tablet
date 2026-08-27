import { create } from 'zustand';

/**
 * ユーザーの操作モードを表す型。
 * - `'select'`: オブジェクトを選択するモード
 * - `'point'`: キャンバス上の座標を指定するモード
 * - `'measure'`: 2点間の距離を計測するモード
 */
export type InteractionMode = 'select' | 'point' | 'measure';

/**
 * コントロールストアの状態定義
 */
interface ControlState {
  /** 現在のインタラクションモード */
  mode: InteractionMode;
  /** ロボットへのコマンド送信中かどうかのフラグ */
  isSending: boolean;

  // Actions
  /** インタラクションモードを切り替える */
  setMode: (mode: InteractionMode) => void;
  /** 送信中フラグを更新する */
  setIsSending: (sending: boolean) => void;
}

/**
 * UI操作状態を管理するZustandストア。
 * 現在のインタラクションモード（選択・座標指定・計測）と、
 * ロボットへのコマンド送信中フラグを保持する。
 *
 * @example
 * ```ts
 * const { mode, setMode } = useControlStore();
 * setMode('point'); // 座標指定モードに切り替え
 * ```
 */
export const useControlStore = create<ControlState>((set) => ({
  mode: 'select',
  isSending: false,

  setMode: (mode) => set({ mode }),
  setIsSending: (sending) => set({ isSending: sending }),
}));
