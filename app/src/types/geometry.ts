export interface Point2D {
  x: number;
  y: number;
}

export interface Size2D {
  width: number;
  height: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type CanvasObjectType = 'circle' | 'rect' | 'line' | 'path';

export interface CanvasObject {
  type: CanvasObjectType;
  position: Point2D;
  props: Record<string, unknown>;
}
