import type { Point2D } from "./index";
import type { RobotStatus } from "./index";

/**
 * WebSocket通信の各メッセージ種別と、その payload 型の対応表。
 * この対応表を単一の情報源（Single Source of Truth）として、
 * {@link MessageType} と {@link WsMessage} を導出する。
 * これにより「type と payload の不整合」を型レベルで防止できる。
 *
 * - `'ping'`: サーバーとの疎通確認 (react -> api)。payload 不要。
 * - `'pong'`: pingに対する返答 (api -> react)。payload 不要。
 * - `'position_update'`: ロボットへの位置指示 (react -> api)。
 * - `'command'`: ロボットへの操作コマンド (react -> api)。
 * - `'status'`: ロボットのステータス更新 (api -> react)。
 * - `'object_sync'`: フィールド上のオブジェクト一覧の同期 (api -> react)。
 */
export interface MessagePayloadMap {
  ping: EmptyPayload;
  pong: EmptyPayload;
  position_update: PositionPayload;
  command: CommandPayload;
  status: StatusPayload;
  error: ErrorPayload;
}

/**
 * WebSocket通信で使用するメッセージの種別。
 * {@link MessagePayloadMap} のキーから導出される。
 */
export type MessageType = keyof MessagePayloadMap;

/**
 * WebSocket通信の基本メッセージ構造。
 * すべてのメッセージはこの形式でJSON化されて送受信される。
 * 型引数 `K`（メッセージ種別）を指定すると、`payload` の型が
 * {@link MessagePayloadMap} により自動的に決定される。
 *
 * @typeParam K - メッセージ種別（省略時は全種別のユニオン）
 *
 * @example
 * ```ts
 * // K を指定すると payload 型が固定される
 * const msg: WsMessage<"position_update"> = {
 *   type: "position_update",
 *   timestamp: Date.now(),
 *   payload: { position: { x: 1, y: 2 } },
 * };
 * ```
 */
export interface WsMessage<K extends MessageType = MessageType> {
  /** メッセージの種別 */
  type: K;
  /** メッセージ送信時のUNIXタイムスタンプ（ミリ秒） */
  timestamp: number;
  /** メッセージの本体データ（種別により型が決まる。ping/pong では省略可） */
  payload?: MessagePayloadMap[K];
}

/**
 * payload を持たないメッセージ（ping / pong）用の空ペイロード型。
 */
export type EmptyPayload = Record<string, never>;

// === 送信系ペイロード（フロントエンド → サーバー） ===

/**
 * 位置更新ペイロード。
 * キャンバス上でユーザーが指定した座標をロボットに送信する際に使用する。
 */
export interface PositionPayload {
  /** 指定された2D座標 */
  position: Point2D;
  direction: number;
}

export type CommandType = "arm_up" | "arm_down" | "stop";

/**
 * コマンドペイロード。
 * ロボットへの操作指示（移動開始、停止、グリップ動作など）を送信する際に使用する。
 */
export interface CommandPayload {
  /** コマンド名（例: 'move', 'stop', 'grab', 'hello'） */
  command: CommandType;
  // /** コマンドに付随するオプションパラメータ */
  params?: Record<string, unknown>;
}

// === 受信系ペイロード（サーバー → フロントエンド） ===

/**
 * ステータス更新ペイロード。
 * サーバーから受信したロボットの現在状態をUIに反映する際に使用する。
 * 実体は {@link RobotStatus}。
 */
export type StatusPayload = RobotStatus;

export interface ErrorPayload {
  message: string;
}
