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
