import { create } from 'zustand';
import type { WsMessage, StatusPayload } from '../types/websocket';

/**
 * WebSocketストアの状態定義
 */
interface WebSocketState {
  /** WebSocket接続が確立されているかどうか */
  isConnected: boolean;
  /** 最後に受信したWebSocketメッセージ（デバッグ・ログ用） */
  lastMessage: WsMessage | null;
  /** ロボットから受信した最新のステータス情報 */
  robotStatus: StatusPayload | null;

  // Actions
  /** 接続状態を更新する（接続/切断時にフックから呼ばれる） */
  setConnected: (connected: boolean) => void;
  /** 受信メッセージを記録する */
  setLastMessage: (msg: WsMessage) => void;
  /** ロボットのステータス情報を更新する */
  setRobotStatus: (status: StatusPayload) => void;
}

/**
 * WebSocket通信状態を管理するZustandストア。
 * 接続状態・最新受信メッセージ・ロボットステータスを保持し、
 * UIコンポーネント（StatusIndicator等）がリアクティブに状態を参照できる。
 *
 * @example
 * ```ts
 * const isConnected = useWebSocketStore((s) => s.isConnected);
 * // 接続状態に応じてUIを切り替える
 * ```
 */
export const useWebSocketStore = create<WebSocketState>((set) => ({
  isConnected: false,
  lastMessage: null,
  robotStatus: null,

  setConnected: (connected) => set({ isConnected: connected }),
  setLastMessage: (msg) => set({ lastMessage: msg }),
  setRobotStatus: (status) => set({ robotStatus: status }),
}));
