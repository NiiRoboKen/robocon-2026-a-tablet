/**
 * 2次元座標を表すインターフェース。
 * キャンバス上のピクセル座標や実世界座標（mm）の両方に使用する。
 */
export interface Point2D {
  /** X座標（横方向の位置） */
  x: number;
  /** Y座標（縦方向の位置） */
  y: number;
}

export interface Size2D {
  width: number;
  height: number;
}

/**
 * 矩形領域を表すインターフェース。
 * 衝突判定やオブジェクトの境界ボックスに使用する。
 */
export interface Rect {
  /** 矩形の左上X座標 */
  x: number;
  /** 矩形の左上Y座標 */
  y: number;
  /** 矩形の幅 */
  width: number;
  /** 矩形の高さ */
  height: number;
}

/**
 * キャンバス上に描画できるオブジェクトの種類。
 * - `'circle'`: 円（ロボットやターゲット地点の表示に使用）
 * - `'rect'`: 矩形（障害物やエリアの表示に使用）
 * - `'line'`: 直線（経路やガイド線の表示に使用）
 * - `'path'`: パス（複雑な軌跡の描画に使用）
 */
export type CanvasObjectType = 'circle' | 'rect' | 'line' | 'path';

/**
 * キャンバス上に描画されるオブジェクトのデータ構造。
 * WebSocketで受信したオブジェクト情報を格納し、Konvaで描画する。
 */
export interface CanvasObject {
  /** オブジェクトの一意識別子 */
  id: string;
  /** オブジェクトの描画タイプ */
  type: CanvasObjectType;
  /** オブジェクトの描画位置 */
  position: Point2D;
  /** 描画用の追加プロパティ（色、サイズ、線幅など） */
  props: Record<string, unknown>;
}
