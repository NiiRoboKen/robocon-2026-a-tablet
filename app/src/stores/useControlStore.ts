import { create } from 'zustand';

/**
 * コントロールストアの状態定義
 */
interface ControlState {
  /** ロボットへのコマンド送信中かどうかのフラグ */
  isSending: boolean;

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
  isSending: false,

  setIsSending: (sending) => set({ isSending: sending }),
}));
