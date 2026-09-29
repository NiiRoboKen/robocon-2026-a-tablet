import type { Point2D, Size2D } from "../types/geometry";
import type {
  ObstacleConfig,
  RectObstacleConfig,
  CircleObstacleConfig,
} from "../types/config";

export interface PathfindingOptions {
  cellSize?: number;
  allowDiagonal?: boolean;
}

interface Node {
  col: number;
  row: number;
  g: number;
  h: number;
  f: number;
  parent: Node | null;
}

function worldToCell(value: number, cellSize: number): number {
  return Math.floor(value / cellSize);
}

function cellToWorld(index: number, cellSize: number): number {
  return index * cellSize + cellSize / 2;
}

function isInsideRect(point: Point2D, obstacle: RectObstacleConfig): boolean {
  const { position, size } = obstacle;
  const direction = obstacle.direction ?? 0;

  const dx = point.x - position.x;
  const dy = point.y - position.y;

  const rad = (-direction * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const localX = dx * cos - dy * sin;
  const localY = dx * sin + dy * cos;

  return (
    Math.abs(localX) <= size.width / 2 && Math.abs(localY) <= size.height / 2
  );
}

function isInsideCircle(
  point: Point2D,
  obstacle: CircleObstacleConfig,
): boolean {
  const dx = point.x - obstacle.position.x;
  const dy = point.y - obstacle.position.y;
  return dx * dx + dy * dy <= obstacle.radius * obstacle.radius;
}

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
    return dCol + dRow + (Math.SQRT2 - 2) * Math.min(dCol, dRow);
  }
  return dCol + dRow;
}

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

  const inBounds = (col: number, row: number): boolean =>
    col >= 0 && col < cols && row >= 0 && row < rows;

  if (!inBounds(startCol, startRow) || !inBounds(goalCol, goalRow)) {
    return null;
  }

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

  if (isCellBlocked(startCol, startRow) || isCellBlocked(goalCol, goalRow)) {
    return null;
  }

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
    let current: Node | null = null;
    for (const node of openMap.values()) {
      if (current === null || node.f < current.f) {
        current = node;
      }
    }
    if (current === null) break;

    const currentKey = cellKey(current.col, current.row);

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

  return null;
}
