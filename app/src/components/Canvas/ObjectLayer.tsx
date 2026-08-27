import { Circle, Rect, Line } from 'react-konva';
import { useCanvasStore } from '../../stores/useCanvasStore';
import type { CanvasObject } from '../../types/geometry';

/**
 * WebSocketで受信したオブジェクトを一覧描画するレイヤーコンポーネント。
 * CanvasStoreのobjects配列を参照し、各オブジェクトをObjectShapeで描画する。
 */
export function ObjectLayer() {
  /** サーバーから同期されたオブジェクト一覧 */
  const objects = useCanvasStore((s) => s.objects);

  return (
    <>
      {objects.map((obj) => (
        <ObjectShape key={obj.id} object={obj} />
      ))}
    </>
  );
}

/**
 * 個々のCanvasObjectをKonvaシェイプとして描画する内部コンポーネント。
 * オブジェクトのtypeに応じてCircle/Rect/Lineを切り替えて描画する。
 *
 * @param props.object - 描画対象のCanvasObjectデータ
 */
function ObjectShape({ object }: { object: CanvasObject }) {
  const { type, position, props } = object;

  switch (type) {
    case 'circle':
      return (
        <Circle
          x={position.x}
          y={position.y}
          radius={(props.radius as number) ?? 10}
          fill={(props.fill as string) ?? '#ff6b6b'}
          stroke={(props.stroke as string) ?? '#333'}
          strokeWidth={(props.strokeWidth as number) ?? 1}
        />
      );
    case 'rect':
      return (
        <Rect
          x={position.x}
          y={position.y}
          width={(props.width as number) ?? 20}
          height={(props.height as number) ?? 20}
          fill={(props.fill as string) ?? '#4ecdc4'}
          stroke={(props.stroke as string) ?? '#333'}
          strokeWidth={(props.strokeWidth as number) ?? 1}
        />
      );
    case 'line':
      return (
        <Line
          points={(props.points as number[]) ?? [0, 0, 50, 50]}
          stroke={(props.stroke as string) ?? '#333'}
          strokeWidth={(props.strokeWidth as number) ?? 2}
        />
      );
    default:
      return null;
  }
}
