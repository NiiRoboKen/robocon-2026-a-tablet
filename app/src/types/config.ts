import type { Point2D, Size2D } from "./geometry";

/**
 * @fileoverview 開発者が事前に設定するパラメータの型定義。
 * ロボットの初期値・サイズ、フィールド、障害物などの静的な設定を
 * 型安全に扱うためのインターフェース群を定義する。
 *
 * 実際の値は `config/index.ts` などの設定ファイルで定義する。
 */

/**
 * 競技のカラーモード
 */
export type ColorMode = "red" | "blue";

/**
 * フィールド（競技領域）の設定。
 * すべての座標・寸法は実世界座標（mm）
 */
export interface FieldConfig {
  /** フィールドの実寸法（mm単位) */
  size: Size2D;
  /** 背景画像ファイルのパス */
  imagePath: string;
}

/**
 * ロボットの初期状態の設定。
 */
export interface RobotInitialState {
  /** 初期位置（実世界座標 mm, フィールド原点基準） */
  position: Point2D;
  /** 中心補正（実世界座標 mm） */
  offset: Point2D;
  /** 機体のサイズ */
  size: Size2D;
  /** 初期の向き（度数法, 0=右方向, 反時計回りが正） */
  direction: number;
}

/**
 * 障害物の形状種別。
 * - `'rect'`: 矩形の障害物
 * - `'circle'`: 円形の障害物
 */
export type ObstacleShape = "rect" | "circle";

/**
 * 矩形の障害物設定。
 * position は矩形の中心を表す（実世界座標 mm）。
 */
export interface RectObstacleConfig {
  /** 形状種別（矩形） */
  shape: "rect";
  /** 障害物の中心座標（実世界座標 mm） */
  position: Point2D;
  /** 障害物の寸法（mm単位） */
  size: Size2D;
  /** 中心を基準とした回転角（度数法, 反時計回りが正, 省略時は 0） */
  direction?: number;
  /** 表示用の説明ラベル（任意） */
  label?: string;
}

/**
 * 円形の障害物設定。
 * position は円の中心を表す（実世界座標 mm）。
 */
export interface CircleObstacleConfig {
  /** 形状種別（円） */
  shape: "circle";
  /** 障害物の中心座標（実世界座標 mm） */
  position: Point2D;
  /** 障害物の半径（mm） */
  radius: number;
  /** 表示用の説明ラベル（任意） */
  label?: string;
}

/**
 * 障害物の設定（矩形または円）。
 * `shape` プロパティで判別できる判別可能ユニオン。
 */
export type ObstacleConfig = RectObstacleConfig | CircleObstacleConfig;

/**
 * 単一カラーモードにおける事前設定パラメータ。
 * フィールド・ロボット・障害物の値は red / blue で個別に定義する。
 */
export interface ModeConfig {
  /** フィールドの設定 */
  field: FieldConfig;
  /** ロボットの設定 */
  robot: RobotInitialState;
  /** 障害物の設定一覧 */
  obstacles: ObstacleConfig[];
}

/**
 * アプリケーション全体の事前設定パラメータ。
 * red / blue の各モードごとに完全に独立した設定を保持する。
 * アプリは必ずどちらか一方のモード設定を使用する。
 */
export type InitialConfig = {
  red: ModeConfig;
  blue: ModeConfig;
};
