import type { Point2D } from "./geometry";

export type RobotState = "idle" | "moving" | "error" | null;

export interface RobotStatus {
  position: Point2D;
  direction: number;
  status: RobotState;
}
