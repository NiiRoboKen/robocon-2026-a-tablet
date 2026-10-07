export type OutboundMessageType = "target_position" | "command" | "belt_launch";
export type InboundMessageType =
  "robot_state" | "log" | "raw" | "resend_request" | "position_update";
export type ControlMessageType = "ping" | "pong" | "status" | "error";

export type MessageType =
  OutboundMessageType | InboundMessageType | ControlMessageType;

export type WebSocketCommands =
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
