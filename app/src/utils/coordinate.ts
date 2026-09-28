import type { Point2D } from "../types/geometry";

// realworld width: 6000, height: 10500

/**
 * キャンバス上のピクセル座標を実世界座標（mm）に変換する。
 * フィールドマップ上のクリック位置をロボット制御用の実座標に変換する際に使用する。
 *
 * @param pixel - キャンバス上のピクセル座標
 * @param scale - スケール係数（1ピクセルあたりの実距離 mm）
 * @returns 実世界座標（mm単位）
 *
 * @example
 * ```ts
 * const world = pixelToWorld({ x: 150, y: 200 });
 * // => { x: 375, y: 500 }
 * ```
 */
export function pixelToWorld(pixel: Point2D, scale: number): Point2D {
  return {
    x: pixel.x / scale,
    y: pixel.y / scale,
  };
}

/**
 * 実世界座標（mm）をキャンバス上のピクセル座標に変換する。
 * ロボットの実位置をフィールドマップ上に描画する際に使用する。
 *
 * @param world - 実世界座標（mm単位）
 * @param scale - スケール係数（1ピクセルあたりの実距離 mm）
 * @returns キャンバス上のピクセル座標
 *
 * @example
 * ```ts
 * const pixel = worldToPixel({ x: 375, y: 500 });
 * // => { x: 150, y: 200 }
 * ```
 */
export function worldToPixel(world: Point2D, scale: number): Point2D {
  return {
    x: world.x * scale,
    y: world.y * scale,
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
export function roundPoint(point: Point2D, decimals = 0): Point2D {
  const factor = 10 ** decimals;
  return {
    x: Math.round(point.x * factor) / factor,
    y: Math.round(point.y * factor) / factor,
  };
}

/**
 * 実世界座標をKonva（キャンバス）のピクセル座標へ変換する（等倍・スケール1:1）。
 *
 * 実世界は原点から右方向がx正・上方向がy正。
 * Konvaは左上が原点で右方向がx正・下方向がy正のため、y軸を反転する。
 *
 * @param point - 実世界座標（原点基準、x右正・y上正）
 * @param origin - キャンバス上での実世界原点の位置（ピクセル座標）
 * @param fieldSize - フィールドのサイズ（未使用だがAPI互換のため保持）
 * @returns Konvaキャンバス上のピクセル座標
 *
 * @example
 * ```ts
 * // 原点がキャンバス左下 (0, height) にある場合
 * coordinatesWorldToPixel({ x: 100, y: 200 }, { x: 0, y: 10500 }, { width: 6000, height: 10500 });
 * // => { x: 100, y: 10300 }
 * ```
 */
export function coordinatesWorldToPixel(
  point: Point2D,
  origin: Point2D,
): Point2D {
  return {
    x: origin.x + point.x,
    y: origin.y - point.y,
  };
}

/**
 * Konva（キャンバス）のピクセル座標を実世界座標へ変換する（等倍・スケール1:1）。
 *
 * {@link coordinatesWorldToPixel} の逆変換。y軸を反転して実世界座標へ戻す。
 *
 * @param point - Konvaキャンバス上のピクセル座標
 * @param origin - キャンバス上での実世界原点の位置（ピクセル座標）
 * @param fieldSize - フィールドのサイズ（未使用だがAPI互換のため保持）
 * @returns 実世界座標（原点基準、x右正・y上正）
 *
 * @example
 * ```ts
 * coordinatesPixelToWorld({ x: 100, y: 10300 }, { x: 0, y: 10500 }, { width: 6000, height: 10500 });
 * // => { x: 100, y: 200 }
 * ```
 */
export function coordinatesPixelToWorld(
  point: Point2D,
  origin: Point2D,
): Point2D {
  return {
    x: point.x - origin.x,
    y: origin.y - point.y,
  };
}

/** 角度（度）を (-180, 180] に正規化する。JSの % が負を返すため mod を2回取る。 */
export function normalizeDegrees(deg: number): number {
  const wrapped = ((((deg + 180) % 360) + 360) % 360) - 180;
  return wrapped === -180 ? 180 : wrapped;
}

/**
 * 内部角（右向き0度・反時計回り正・ラジアン）を
 * 表示/送信用の角度（上向き0度・反時計回り正・度・(-180,180]）へ変換する。
 * 上向きが内部の+90度に相当するため90度引き、正規化する。
 */
export function directionToDisplayDegrees(rad: number): number {
  return normalizeDegrees((rad * 180) / Math.PI - 90);
}
