import type { Point2D, Size2D } from "./geometry";
import type { PositionPayload } from "./websocket";

export type ColorMode = "red" | "blue";

export interface StageConfig {
  size: Size2D;
  margin: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}

export interface FieldConfig {
  size: Size2D;
  imagePath: string;
}

export interface RobotInitialState {
  originPosition: Point2D;
  offset: Point2D;
  size: Size2D;
  direction: number;
}

export type ObstacleShape = "rect" | "circle";

export interface RectObstacleConfig {
  shape: "rect";
  position: Point2D;
  size: Size2D;
  direction?: number;
  label?: string;
}

export interface CircleObstacleConfig {
  shape: "circle";
  position: Point2D;
  radius: number;
  label?: string;
}

export type ObstacleConfig = RectObstacleConfig | CircleObstacleConfig;

export interface TargetPositionConfig {
  x: number;
  y: number;
  direction: number;
  label?: string;
}

export interface ModeConfig {
  stage: StageConfig;
  field: FieldConfig;
  robot: RobotInitialState;
  obstacles: ObstacleConfig[];
  targetPositions: TargetPositionConfig[];
  firstActionPosition: PositionPayload;
}

export type InitialConfig = {
  red: ModeConfig;
  blue: ModeConfig;
};

export type BeltAcceleration = {
  fix1: number;
  fix2: number;
  fix3: number;
  table: number;
};
