export type OutboundMessageType = "target_position" | "command" | "belt_launch";
export type InboundMessageType =
  "robot_state" | "log" | "raw" | "resend_request" | "position_update";
export type ControlMessageType = "ping" | "pong" | "status" | "error";

export type MessageType =
  OutboundMessageType | InboundMessageType | ControlMessageType;

export type WebSocketCommands =
  | "gamepad_use"
  | "tablet_use"
  | "load_belt"
  | "reload_belt"
  | "reload_finish_belt"
  | "launch_belt";
