import type { Point2D } from "./geometry";

/**
 * ロボットの動作状態を表す型。
 * - `'idle'`: 待機中（コマンド待ち）
 * - `'moving'`: 移動中（目標地点へ向かっている）
 * - `'error'`: エラー発生（手動介入が必要）
 */
export type RobotState = "idle" | "moving" | "error" | null;

/**
 * ロボットの現在の状態を表すインターフェース。
 * サーバーから受信したロボット情報をUIに反映するために使用する。
 */
export interface RobotStatus {
  /** フィールド上のロボット現在位置 */
  position: Point2D;
  /** ロボットの向き（度数法、0=右方向、反時計回りが正） */
  direction: number;
  /** ロボットの現在の動作状態 */
  status: RobotState;
}
