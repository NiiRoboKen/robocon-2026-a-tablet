import type { Point2D, Size2D } from "../types/geometry";
import type {
  ObstacleConfig,
  RectObstacleConfig,
  CircleObstacleConfig,
} from "../types/config";

/**
 * @fileoverview A* アルゴリズムによる経路生成ユーティリティ。
 *
 * フィールドを一定間隔のグリッドに離散化し、`config/index.ts` で定義された
 * 障害物（矩形・円）を回避しながら、開始地点から目標地点までの経路を探索する。
 *
 * 座標系: すべて実世界座標（mm単位）。原点はフィールド左上、
 * X軸は右方向が正、Y軸は下方向が正。
 *
 * 注意: 現時点ではロボットの機体サイズは考慮しない（点としてのロボットを想定）。
 *
 * @example
 * ```ts
 * import { findPath } from "../utils/pathfinding";
 * import { getConfig } from "../config";
 *
 * const cfg = getConfig("red");
 * const path = findPath(
 *   cfg.robot.position,
 *   { x: 1000, y: 1000 },
 *   cfg.obstacles,
 *   cfg.field.size,
 * );
 * ```
 */

/**
 * A* 経路探索のオプション設定。
 */
export interface PathfindingOptions {
  /** グリッドの1セルの大きさ（mm単位, デフォルト: 100） */
  cellSize?: number;
  /**
   * 斜め移動を許可するかどうか（デフォルト: true）。
   * true の場合は8方向、false の場合は4方向の移動になる。
   */
  allowDiagonal?: boolean;
}

/**
 * A* 探索で使用するグリッド上のノード。
 */
interface Node {
  /** グリッド上の列インデックス（X方向） */
  col: number;
  /** グリッド上の行インデックス（Y方向） */
  row: number;
  /** 開始ノードからの実コスト */
  g: number;
  /** ゴールまでの推定コスト（ヒューリスティック） */
  h: number;
  /** 総コスト（g + h） */
  f: number;
  /** 経路復元用の親ノード */
  parent: Node | null;
}

/**
 * 実世界座標をグリッドのセルインデックスに変換する。
 */
function worldToCell(value: number, cellSize: number): number {
  return Math.floor(value / cellSize);
}

/**
 * グリッドのセルインデックスを、そのセル中心の実世界座標に変換する。
 */
function cellToWorld(index: number, cellSize: number): number {
  return index * cellSize + cellSize / 2;
}

/**
 * 指定した実世界座標が矩形障害物の内部にあるかどうかを判定する。
 * 矩形の `position` は中心を表し、`direction`（度数法, 反時計回りが正）で
 * 回転している場合も考慮する。
 */
function isInsideRect(point: Point2D, obstacle: RectObstacleConfig): boolean {
  const { position, size } = obstacle;
  const direction = obstacle.direction ?? 0;

  // 点を矩形の中心を基準としたローカル座標に変換する。
  const dx = point.x - position.x;
  const dy = point.y - position.y;

  // 矩形の回転を打ち消す方向（-direction）に点を回転させる。
  const rad = (-direction * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const localX = dx * cos - dy * sin;
  const localY = dx * sin + dy * cos;

  return (
    Math.abs(localX) <= size.width / 2 && Math.abs(localY) <= size.height / 2
  );
}

/**
 * 指定した実世界座標が円形障害物の内部にあるかどうかを判定する。
 */
function isInsideCircle(
  point: Point2D,
  obstacle: CircleObstacleConfig,
): boolean {
  const dx = point.x - obstacle.position.x;
  const dy = point.y - obstacle.position.y;
  return dx * dx + dy * dy <= obstacle.radius * obstacle.radius;
}

/**
 * 指定した実世界座標がいずれかの障害物の内部にあるかどうかを判定する。
 *
 * @param point - 判定対象の実世界座標（mm）
 * @param obstacles - 障害物の設定一覧
 * @returns 障害物内部にあれば true
 */
export function isBlocked(point: Point2D, obstacles: ObstacleConfig[]): boolean {
  for (const obstacle of obstacles) {
    if (obstacle.shape === "rect") {
      if (isInsideRect(point, obstacle)) return true;
    } else {
      if (isInsideCircle(point, obstacle)) return true;
    }
  }
  return false;
}

/**
 * 2つのセル間のヒューリスティックコストを計算する。
 * 斜め移動を許可する場合はオクタイル距離、そうでなければマンハッタン距離を用いる。
 */
function heuristic(
  aCol: number,
  aRow: number,
  bCol: number,
  bRow: number,
  allowDiagonal: boolean,
): number {
  const dCol = Math.abs(aCol - bCol);
  const dRow = Math.abs(aRow - bRow);
  if (allowDiagonal) {
    // オクタイル距離: 直線コスト1、斜めコスト√2
    return dCol + dRow + (Math.SQRT2 - 2) * Math.min(dCol, dRow);
  }
  return dCol + dRow;
}

/**
 * A* アルゴリズムを用いて、開始地点から目標地点までの経路を生成する。
 *
 * フィールドを `cellSize` 間隔のグリッドに離散化し、障害物セルを回避しながら
 * 最短経路を探索する。返される経路は各グリッドセル中心の実世界座標の配列で、
 * 先頭要素が開始地点、末尾要素が目標地点に対応する。
 *
 * 経路が存在しない場合（目標が障害物内、または到達不能）は `null` を返す。
 *
 * @param start - 開始地点の実世界座標（mm）
 * @param goal - 目標地点の実世界座標（mm）
 * @param obstacles - 回避すべき障害物の設定一覧
 * @param fieldSize - フィールドの実寸法（mm）。探索範囲の境界に使用する。
 * @param options - 探索オプション（セルサイズ、斜め移動の可否）
 * @returns 経路を構成する実世界座標の配列。経路がなければ `null`。
 *
 * @example
 * ```ts
 * const path = findPath(
 *   { x: 5300, y: 9800 },
 *   { x: 1000, y: 1000 },
 *   cfg.obstacles,
 *   cfg.field.size,
 *   { cellSize: 100, allowDiagonal: true },
 * );
 * ```
 */
export function findPath(
  start: Point2D,
  goal: Point2D,
  obstacles: ObstacleConfig[],
  fieldSize: Size2D,
  options: PathfindingOptions = {},
): Point2D[] | null {
  const cellSize = options.cellSize ?? 100;
  const allowDiagonal = options.allowDiagonal ?? true;

  const cols = Math.ceil(fieldSize.width / cellSize);
  const rows = Math.ceil(fieldSize.height / cellSize);

  const startCol = worldToCell(start.x, cellSize);
  const startRow = worldToCell(start.y, cellSize);
  const goalCol = worldToCell(goal.x, cellSize);
  const goalRow = worldToCell(goal.y, cellSize);

  /** セルが探索範囲内かどうかを判定する。 */
  const inBounds = (col: number, row: number): boolean =>
    col >= 0 && col < cols && row >= 0 && row < rows;

  if (!inBounds(startCol, startRow) || !inBounds(goalCol, goalRow)) {
    return null;
  }

  /** セル中心が障害物内かどうかを判定する（結果をキャッシュする）。 */
  const blockedCache = new Map<number, boolean>();
  const isCellBlocked = (col: number, row: number): boolean => {
    const key = row * cols + col;
    const cached = blockedCache.get(key);
    if (cached !== undefined) return cached;
    const center: Point2D = {
      x: cellToWorld(col, cellSize),
      y: cellToWorld(row, cellSize),
    };
    const blocked = isBlocked(center, obstacles);
    blockedCache.set(key, blocked);
    return blocked;
  };

  // 開始・目標が障害物内にある場合は経路を生成できない。
  if (isCellBlocked(startCol, startRow) || isCellBlocked(goalCol, goalRow)) {
    return null;
  }

  // 移動方向の定義（4方向 or 8方向）。
  const directions: Array<[number, number]> = allowDiagonal
    ? [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]
    : [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];

  const cellKey = (col: number, row: number): number => row * cols + col;

  const openMap = new Map<number, Node>();
  const closed = new Set<number>();

  const startNode: Node = {
    col: startCol,
    row: startRow,
    g: 0,
    h: heuristic(startCol, startRow, goalCol, goalRow, allowDiagonal),
    f: 0,
    parent: null,
  };
  startNode.f = startNode.g + startNode.h;
  openMap.set(cellKey(startCol, startRow), startNode);

  while (openMap.size > 0) {
    // オープンリストから f が最小のノードを取り出す。
    let current: Node | null = null;
    for (const node of openMap.values()) {
      if (current === null || node.f < current.f) {
        current = node;
      }
    }
    if (current === null) break;

    const currentKey = cellKey(current.col, current.row);

    // ゴールに到達したら経路を復元して返す。
    if (current.col === goalCol && current.row === goalRow) {
      const path: Point2D[] = [];
      let node: Node | null = current;
      while (node !== null) {
        path.push({
          x: cellToWorld(node.col, cellSize),
          y: cellToWorld(node.row, cellSize),
        });
        node = node.parent;
      }
      path.reverse();

      // 経路の端点を、離散化前の正確な開始・目標座標に置き換える。
      if (path.length > 0) {
        path[0] = { ...start };
        path[path.length - 1] = { ...goal };
      }
      return path;
    }

    openMap.delete(currentKey);
    closed.add(currentKey);

    for (const [dCol, dRow] of directions) {
      const nextCol = current.col + dCol;
      const nextRow = current.row + dRow;

      if (!inBounds(nextCol, nextRow)) continue;
      const nextKey = cellKey(nextCol, nextRow);
      if (closed.has(nextKey)) continue;
      if (isCellBlocked(nextCol, nextRow)) continue;

      // 斜め移動時は角を通り抜けないよう、隣接セルの障害物を確認する。
      if (dCol !== 0 && dRow !== 0) {
        if (
          isCellBlocked(current.col + dCol, current.row) ||
          isCellBlocked(current.col, current.row + dRow)
        ) {
          continue;
        }
      }

      const moveCost = dCol !== 0 && dRow !== 0 ? Math.SQRT2 : 1;
      const tentativeG = current.g + moveCost;

      const existing = openMap.get(nextKey);
      if (existing === undefined) {
        const neighbor: Node = {
          col: nextCol,
          row: nextRow,
          g: tentativeG,
          h: heuristic(nextCol, nextRow, goalCol, goalRow, allowDiagonal),
          f: 0,
          parent: current,
        };
        neighbor.f = neighbor.g + neighbor.h;
        openMap.set(nextKey, neighbor);
      } else if (tentativeG < existing.g) {
        existing.g = tentativeG;
        existing.f = tentativeG + existing.h;
        existing.parent = current;
      }
    }
  }

  // オープンリストが空になっても到達できなかった場合は経路なし。
  return null;
}
