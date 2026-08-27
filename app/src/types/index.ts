/**
 * @fileoverview 型定義の集約エクスポートモジュール。
 * アプリケーション全体で使用する型を一箇所からインポートできるようにする。
 *
 * @example
 * ```ts
 * import type { Point2D, WsMessage, RobotState } from '../types';
 * ```
 */

// --- 幾何学・座標系の型 ---
export type {
  Point2D,
  Size2D,
  Rect,
  CanvasObjectType,
  CanvasObject,
} from './geometry';

// --- WebSocket通信の型 ---
export type {
  MessageType,
  WsMessage,
  PositionPayload,
  CommandPayload,
  ObjectSyncPayload,
  StatusPayload,
} from './websocket';

// --- ロボット状態の型 ---
export type { RobotStatus, RobotState } from './robot';
