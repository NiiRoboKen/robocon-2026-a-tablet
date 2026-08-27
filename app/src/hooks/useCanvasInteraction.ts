import { useCallback } from 'react';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useCanvasStore } from '../stores/useCanvasStore';
import { useControlStore } from '../stores/useControlStore';
import type { Point2D } from '../types/geometry';

/**
 * キャンバス上のユーザー操作（クリック・マウス移動・マウス離脱）を処理するカスタムフック。
 * Konvaステージのイベントハンドラを提供し、操作モードに応じた座標選択やカーソル追跡を行う。
 *
 * @returns ステージに設定するイベントハンドラ群
 *
 * @example
 * ```tsx
 * const { handleStageClick, handleStageMouseMove, handleStageMouseLeave } = useCanvasInteraction();
 * <Stage onClick={handleStageClick} onMouseMove={handleStageMouseMove} onMouseLeave={handleStageMouseLeave} />
 * ```
 */
export function useCanvasInteraction() {
  const { setSelectedPoint, setCursorPosition } = useCanvasStore();
  /** 現在の操作モード（'point'モード時のみクリックで座標を選択する） */
  const mode = useControlStore((s) => s.mode);

  /**
   * ステージクリック時のハンドラ。
   * 'point'モードの場合、クリック位置を選択座標としてストアに保存する。
   */
  const handleStageClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;

      const pointerPos = stage.getPointerPosition();
      if (!pointerPos) return;

      const point: Point2D = { x: pointerPos.x, y: pointerPos.y };

      if (mode === 'point') {
        setSelectedPoint(point);
      }
    },
    [mode, setSelectedPoint],
  );

  /**
   * マウス移動時のハンドラ。
   * カーソル位置をストアに反映し、CoordinateDisplayなどで表示する。
   */
  const handleStageMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;

      const pointerPos = stage.getPointerPosition();
      if (!pointerPos) return;

      setCursorPosition({ x: pointerPos.x, y: pointerPos.y });
    },
    [setCursorPosition],
  );

  /**
   * マウスがステージ外に出た時のハンドラ。
   * カーソル位置をnullにリセットし、座標表示を非表示にする。
   */
  const handleStageMouseLeave = useCallback(() => {
    setCursorPosition(null);
  }, [setCursorPosition]);

  return {
    handleStageClick,
    handleStageMouseMove,
    handleStageMouseLeave,
  };
}
