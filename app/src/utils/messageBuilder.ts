import type {
  WsMessage,
  MessageType,
  PositionPayload,
  CommandPayload,
} from '../types/websocket';
import type { Point2D } from '../types/geometry';

/**
 * WebSocketメッセージを組み立てる汎用ヘルパー関数。
 * タイムスタンプを自動付与し、型安全なメッセージオブジェクトを生成する。
 *
 * @typeParam T - ペイロードの型
 * @param type - メッセージ種別（例: 'command', 'position_update'）
 * @param payload - メッセージに含めるデータ本体
 * @returns タイムスタンプ付きのWebSocketメッセージ
 *
 * @example
 * ```ts
 * const msg = buildMessage('command', { command: 'stop' });
 * ```
 */
export function buildMessage<T>(type: MessageType, payload: T): WsMessage<T> {
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
  target: string,
  position: Point2D,
): WsMessage<PositionPayload> {
  return buildMessage('position_update', { target, position });
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
export function buildCommandMessage(
  command: string,
  params?: Record<string, unknown>,
): WsMessage<CommandPayload> {
  return buildMessage('command', { command, params });
}
