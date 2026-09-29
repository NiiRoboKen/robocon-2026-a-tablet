import type { Point2D } from "./index";
import type { RobotStatus } from "./index";

export interface MessagePayloadMap {
  ping: EmptyPayload;
  pong: EmptyPayload;
  position_update: PositionPayload;
  command: CommandPayload;
  status: StatusPayload;
  error: ErrorPayload;
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
