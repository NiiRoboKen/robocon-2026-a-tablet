import type {
  WsMessage,
  MessageType,
  MessagePayloadMap,
  CommandType,
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
): WsMessage<"position_update"> {
  return buildMessage("position_update", { position: p, direction: d });
}

export function buildCommandMessage(c: CommandType): WsMessage<"command"> {
  return buildMessage("command", { command: c });
}
