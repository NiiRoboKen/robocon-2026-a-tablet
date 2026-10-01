import type { Point2D } from "./index";
import type { RobotStatus } from "./index";

export interface MessagePayloadMap {
  ping: EmptyPayload;
  pong: EmptyPayload;
  position_update: PositionPayload;
  command: CommandPayload;
  status: StatusPayload;
  error: ErrorPayload;
  // ESP → tablet 方向（ESP がシリアルへ出力し api が中継する種別）
  robot_state: RobotStatePayload;
}

export type MessageType = keyof MessagePayloadMap;

export interface WsMessage<K extends MessageType = MessageType> {
  type: K;
  timestamp: number;
  payload?: MessagePayloadMap[K];
}

export type EmptyPayload = Record<string, never>;

export interface PositionPayload {
  position: Point2D;
  direction: number;
}

export type CommandType = "arm_up" | "arm_down" | "stop";

export interface CommandPayload {
  command: CommandType;
  params?: Record<string, unknown>;
}

export type StatusPayload = RobotStatus;

export interface ErrorPayload {
  message: string;
}

/**
 * ESP → tablet 方向のロボット状態。
 * ESP の `StateData`(message.h) / `emitStateData`(serial_emit.h) に対応する。
 */
export interface RobotStatePayload {
  gamepad_used: boolean;
  load_belt: boolean;
  reload_belt: boolean;
  reload_finish_belt: boolean;
  launch_belt: boolean;
  launch_pos_belt: number;
  acc_pos_belt: number;
}

/**
 * ESP → tablet 方向のログ。
 * ESP の `emitLog`(serial_emit.h) に対応し、payload ではなく top-level に情報を持つ。
 */
export interface LogMessage {
  type: "log";
  timestamp: number;
  level: "info" | "warn" | "error";
  msg: string;
}

/**
 * ESP → tablet 方向の生データ。
 * ESP の `emitRaw`(serial_emit.h) に対応し、デコード未対応/サイズ不一致の受信を表す。
 */
export interface RawMessage {
  type: "raw";
  timestamp: number;
  msg_type: number;
  data: number[];
}

/**
 * ESP → tablet 方向の再送要求。
 * ESP が tablet → ESP のJSONパースに失敗したときに送られる。
 * 実際の再送は api 側で完結する（直前にシリアルへ送った行を api が再送する）。
 * app はこのメッセージを受信・表示するのみで、再送処理は行わない。
 */
export interface ResendRequestMessage {
  type: "resend_request";
  timestamp: number;
  reason?: string;
}

/**
 * WebSocket で受信しうる全メッセージ。
 * payload ベースの通常メッセージに加え、ESP 由来の log/raw/resend_request(top-level フィールド)を含む。
 */
export type InboundMessage =
  | WsMessage
  | LogMessage
  | RawMessage
  | ResendRequestMessage;
