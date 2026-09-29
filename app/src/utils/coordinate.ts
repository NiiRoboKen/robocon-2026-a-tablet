import type { Point2D } from "../types/geometry";

// realworld width: 6000, height: 10500

export function pixelToWorld(pixel: Point2D, scale: number): Point2D {
  return {
    x: pixel.x / scale,
    y: pixel.y / scale,
  };
}

export function worldToPixel(world: Point2D, scale: number): Point2D {
  return {
    x: world.x * scale,
    y: world.y * scale,
  };
}

export function distance(a: Point2D, b: Point2D): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function roundPoint(point: Point2D, decimals = 0): Point2D {
  const factor = 10 ** decimals;
  return {
    x: Math.round(point.x * factor) / factor,
    y: Math.round(point.y * factor) / factor,
  };
}

export function coordinatesWorldToPixel(
  point: Point2D,
  origin: Point2D,
): Point2D {
  return {
    x: origin.x + point.x,
    y: origin.y - point.y,
  };
}

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
