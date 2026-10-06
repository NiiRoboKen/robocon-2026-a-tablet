import type {
  WsMessage,
  MessageType,
  MessagePayloadMap,
  Commands,
} from "../types/websocket";
import type { Point2D } from "../types/geometry";

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

export function buildPositionMessage(
  p: Point2D,
  d: number,
): WsMessage<"target_position"> {
  return buildMessage("target_position", { x: p.x, y: p.y, direction: d });
}

export function buildCommandMessage(c: Commands): WsMessage<"command"> {
  return buildMessage("command", { command: c });
}
