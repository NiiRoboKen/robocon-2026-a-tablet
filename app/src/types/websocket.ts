import type { Point2D, CanvasObject } from "./geometry";

/**
 * WebSocket通信で使用するメッセージの種別。
 * - 'ping': サーバーとの疎通確認
 * - `'position_update'`: ロボットへの位置指示（フロントエンド → サーバー）
 * - `'command'`: ロボットへの操作コマンド（フロントエンド → サーバー）
 * - `'object_sync'`: フィールド上のオブジェクト同期（サーバー → フロントエンド）
 * - `'status'`: ロボットのステータス更新（サーバー → フロントエンド）
 */
export type MessageType =
  "pong" | "ping" | "position_update" | "command" | "object_sync" | "status";

/**
 * WebSocket通信の基本メッセージ構造。
 * すべてのメッセージはこの形式でJSON化されて送受信される。
 *
 * @typeParam T - ペイロードの型（メッセージ種別ごとに異なる）
 */
export interface WsMessage<T = unknown> {
  /** メッセージの種別 */
  type: MessageType;
  /** メッセージ送信時のUNIXタイムスタンプ（ミリ秒） */
  timestamp: number;
  /** メッセージの本体データ */
  payload: T;
}

// === 送信系ペイロード（フロントエンド → サーバー） ===

/**
 * 位置更新ペイロード。
 * キャンバス上でユーザーが指定した座標をロボットに送信する際に使用する。
 */
export interface PositionPayload {
  /** 送信先のロボットまたはターゲット識別名（例: 'robot-1'） */
  target: string;
  /** 指定された2D座標 */
  position: Point2D;
}

/**
 * コマンドペイロード。
 * ロボットへの操作指示（移動開始、停止、グリップ動作など）を送信する際に使用する。
 */
export interface CommandPayload {
  /** コマンド名（例: 'move', 'stop', 'grab', 'hello'） */
  command: string;
  /** コマンドに付随するオプションパラメータ */
  params?: Record<string, unknown>;
}

// === 受信系ペイロード（サーバー → フロントエンド） ===

/**
 * オブジェクト同期ペイロード。
 * サーバーからフィールド上の全オブジェクト情報を一括で受信する際に使用する。
 */
export interface ObjectSyncPayload {
  /** フィールド上のオブジェクト一覧 */
  objects: CanvasObject[];
}

/**
 * ステータス更新ペイロード。
 * ロボットの現在状態（位置、動作状態など）をリアルタイムで受信する際に使用する。
 */
export interface StatusPayload {
  /** ステータスを送信したロボットのID */
  robotId: string;
  /** ロボットの動作状態（例: 'idle', 'moving', 'error'） */
  state: string;
  /** ロボットの現在位置（取得可能な場合） */
  position?: Point2D;
}
