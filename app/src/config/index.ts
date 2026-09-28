import type { ColorMode, ModeConfig, InitialConfig } from "../types/config";

/**
 * @fileoverview シミュレーション・制御用の事前設定パラメータ。
 *
 * このファイルは開発者が手動で編集する設定ファイルです。
 * ロボットの初期値やサイズ、フィールド寸法、障害物の座標・サイズなどを
 * `red` / `blue` の2モードそれぞれで一元的に定義します。
 * アプリは必ずどちらか一方のモードの状態を取り、モードごとに全パラメータが異なります。
 *
 * 座標系: すべて実世界座標（mm単位）。原点はフィールド左上、
 * X軸は右方向が正、Y軸は下方向が正。向きは度数法で 0=右方向、反時計回りが正。
 *
 * @example
 * ```ts
 * import { simulationConfig, getModeConfig } from "../config";
 * const cfg = getConfig("red");
 * const robot = cfg.robots[0];
 * ```
 */

/**
 * red モードの設定。
 */
const redConfig: ModeConfig = {
  stage: {
    size: { width: 5850, height: 10800 },
    margin: {
      left: 300,
      right: 150,
      top: 150,
      bottom: 150,
    },
  },
  field: {
    size: { width: 5400, height: 10500 },
    imagePath: "/fieldRedImage.png",
  },
  // robot: {
  //   originPosition: { x: 1800, y: 10500 - 500 },
  //   offset: { x: 500, y: 500 },
  //   size: { width: 1000, height: 1000 },
  //   direction: 0,
  // },
  robot: {
    originPosition: { x: 1500, y: 10500 - 500 },
    offset: { x: 500, y: 500 },
    size: { width: 1000, height: 1000 },
    direction: 0,
  },
  obstacles: [
    {
      shape: "rect",
      position: { x: 3000, y: 5000 },
      size: { width: 500, height: 500 },
      direction: 0,
      label: "学習椅子",
    },
    {
      shape: "circle",
      position: { x: 5000, y: 7000 },
      radius: 300,
      label: "カラーコーン",
    },
  ],
};

/**
 * blue モードの設定。
 */
const blueConfig: ModeConfig = {
  stage: {
    size: { width: 5850, height: 10800 },
    margin: {
      left: 150,
      right: 300,
      top: 150,
      bottom: 150,
    },
  },
  field: {
    size: { width: 5400, height: 10500 },
    imagePath: "/fieldBlueImage.png",
  },
  robot: {
    originPosition: { x: 3900, y: 10500 - 500 },
    offset: { x: 500, y: 500 },
    size: { width: 1000, height: 1000 },
    direction: 0,
  },
  obstacles: [
    {
      shape: "rect",
      position: { x: 3000, y: 5000 },
      size: { width: 500, height: 500 },
      direction: 0,
      label: "学習椅子",
    },
    {
      shape: "circle",
      position: { x: 1000, y: 7000 },
      radius: 300,
      label: "カラーコーン",
    },
  ],
};

export const Config: InitialConfig = {
  red: redConfig,
  blue: blueConfig,
};

/**
 * 指定したカラーモードの設定を取得する。
 *
 * @param mode - カラーモード（'red' または 'blue'）
 * @returns 該当モードの設定
 *
 * @example
 * ```ts
 * const cfg = getConfig(colorMode); // colorMode は必ず red か blue
 * ```
 */
export function getConfig(mode: ColorMode): ModeConfig {
  return Config[mode];
}
