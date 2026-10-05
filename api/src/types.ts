export type OutboundMessageType = "position_update" | "command";
export type InboundMessageType =
  "robot_state" | "log" | "raw" | "resend_request";
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
