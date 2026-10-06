export interface MessagePayloadMap {
  ping: EmptyPayload;
  pong: EmptyPayload;
  target_position: PositionPayload;
  belt_launch: BeltLaunchPayload;
  command: CommandPayload;
  error: ErrorPayload;
  // ESP -> tablet
  position_update: PositionPayload;
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
  x: number;
  y: number;
  direction: number;
}

export interface BeltLaunchPayload {
  acceleration: number;
}

export type Commands =
  | "gamepad_use"
  | "tablet_use"
  | "reboot"
  | "belt_load"
  | "belt_reload"
  | "belt_reload_finish"
  | "belt_desk"
  | "belt_bucket_low"
  | "belt_bucket_middle"
  | "belt_bucket_high"
  | "belt_flag"
  | "belt_elevation"
  | "roller_start"
  | "roller_launch"
  | "bucket_low"
  | "bucket_middle"
  | "bucket_high"
  | "bucket_release"
  | "floor_on"
  | "floor_off";

export interface CommandPayload {
  command: Commands;
}

export interface ErrorPayload {
  message: string;
}

export interface RobotStatePayload {
  gamepad_used: boolean;
  load_belt: boolean;
  reload_belt: boolean;
  reload_finish_belt: boolean;
  launch_belt: boolean;
  launch_pos_belt: number;
  acc_pos_belt: number;
}
