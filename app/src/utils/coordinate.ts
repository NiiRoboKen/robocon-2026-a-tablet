import type { Point2D } from '../types/geometry';

// realworld width: 6000, height: 10500

/**
 * キャンバス上のピクセル座標を実世界座標（mm）に変換する。
 * フィールドマップ上のクリック位置をロボット制御用の実座標に変換する際に使用する。
 *
 * @param pixel - キャンバス上のピクセル座標
 * @param scale - スケール係数（1ピクセルあたりの実距離 mm）
 * @param offset - キャンバス原点のオフセット（デフォルト: {x:0, y:0}）
 * @returns 実世界座標（mm単位）
 *
 * @example
 * ```ts
 * const world = pixelToWorld({ x: 150, y: 200 }, 2.5);
 * // => { x: 375, y: 500 }
 * ```
 */
export function pixelToWorld(
  pixel: Point2D,
  scale: number,
  offset: Point2D = { x: 0, y: 0 },
): Point2D {
  return {
    x: (pixel.x - offset.x) * scale,
    y: (pixel.y - offset.y) * scale,
  };
}

/**
 * 実世界座標（mm）をキャンバス上のピクセル座標に変換する。
 * ロボットの実位置をフィールドマップ上に描画する際に使用する。
 *
 * @param world - 実世界座標（mm単位）
 * @param scale - スケール係数（1ピクセルあたりの実距離 mm）
 * @param offset - キャンバス原点のオフセット（デフォルト: {x:0, y:0}）
 * @returns キャンバス上のピクセル座標
 *
 * @example
 * ```ts
 * const pixel = worldToPixel({ x: 375, y: 500 }, 2.5);
 * // => { x: 150, y: 200 }
 * ```
 */
export function worldToPixel(
  world: Point2D,
  scale: number,
  offset: Point2D = { x: 0, y: 0 },
): Point2D {
  return {
    x: world.x / scale + offset.x,
    y: world.y / scale + offset.y,
  };
}

/**
 * 2点間のユークリッド距離を計算する。
 * 障害物との距離測定やロボット間の距離判定に使用する。
 *
 * @param a - 1つ目の座標点
 * @param b - 2つ目の座標点
 * @returns 2点間の距離（入力と同じ単位）
 *
 * @example
 * ```ts
 * const d = distance({ x: 0, y: 0 }, { x: 3, y: 4 });
 * // => 5
 * ```
 */
export function distance(a: Point2D, b: Point2D): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * 座標の各成分を指定した小数点以下の桁数で丸める。
 * 表示用の座標整形や浮動小数点誤差の抑制に使用する。
 *
 * @param point - 丸め対象の座標
 * @param decimals - 小数点以下の桁数（デフォルト: 1）
 * @returns 丸められた座標
 *
 * @example
 * ```ts
 * const rounded = roundPoint({ x: 3.456, y: 7.891 }, 2);
 * // => { x: 3.46, y: 7.89 }
 * ```
 */
export function roundPoint(point: Point2D, decimals = 1): Point2D {
  const factor = 10 ** decimals;
  return {
    x: Math.round(point.x * factor) / factor,
    y: Math.round(point.y * factor) / factor,
  };
}
