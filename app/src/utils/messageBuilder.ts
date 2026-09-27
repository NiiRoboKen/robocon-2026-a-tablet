import type {
  WsMessage,
  MessageType,
  MessagePayloadMap,
  CommandType,
} from "../types/websocket";
import type { Point2D } from "../types/geometry";

/**
 * WebSocketメッセージを組み立てる汎用ヘルパー関数。
 * タイムスタンプを自動付与し、型安全なメッセージオブジェクトを生成する。
 *
 * 型引数 `K`（メッセージ種別）に応じて `payload` の型が
 * {@link MessagePayloadMap} により自動決定される。
 * `ping` / `pong` のように payload 不要な種別では第2引数を省略できる。
 *
 * @typeParam K - メッセージ種別
 * @param type - メッセージ種別（例: 'command', 'position_update', 'ping'）
 * @param payload - メッセージに含めるデータ本体（種別により型が決まる）
 * @returns タイムスタンプ付きのWebSocketメッセージ
 *
 * @example
 * ```ts
 * buildMessage("ping");                                    // payload 省略可
 * buildMessage("command", { command: "stop" });            // OK
 * buildMessage("position_update", { position: { x: 1, y: 2 } }); // OK
 * // buildMessage("position_update", { command: "stop" }); // 型エラー
 * ```
 */
export function buildMessage<K extends MessageType>(
  type: K,
  payload?: MessagePayloadMap[K],
): WsMessage<K> {
  return {
    type,
    timestamp: Date.now(),
    payload,
  };
}

/**
 * 位置更新メッセージを組み立てる。
 * キャンバス上で選択した座標をロボットに送る際に使用する。
 *
 * @param target - 送信先のロボットまたはターゲット名（例: 'robot-1'）
 * @param position - 指定された2D座標
 * @returns position_update型のWebSocketメッセージ
 *
 * @example
 * ```ts
 * const msg = buildPositionMessage('robot-1', { x: 100, y: 200 });
 * ```
 */
export function buildPositionMessage(
  p: Point2D,
  d: number,
): WsMessage<"position_update"> {
  return buildMessage("position_update", { position: p, direction: d });
}

/**
 * コマンドメッセージを組み立てる。
 * ロボットへの操作指示（移動、停止、グリップ動作など）を送る際に使用する。
 *
 * @param command - コマンド名（例: 'move', 'stop', 'grab', 'hello'）
 * @param params - コマンドに付随するオプションパラメータ
 * @returns command型のWebSocketメッセージ
 *
 * @example
 * ```ts
 * const msg = buildCommandMessage('move', { speed: 100, direction: 'forward' });
 * ```
 */
export function buildCommandMessage(c: CommandType): WsMessage<"command"> {
  return buildMessage("command", { command: c });
}
