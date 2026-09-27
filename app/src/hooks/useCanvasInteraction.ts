import { useCallback } from "react";
import type { KonvaEventObject } from "konva/lib/Node";
import { useCanvasStore } from "../stores/useCanvasStore";
import type { Point2D } from "../types/geometry";

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
  const {
    selectedPosition,
    setSelectedPosition,
    setCursorPosition,
    setSelectedDirection,
  } = useCanvasStore();


  /**
   * ステージクリック時のハンドラ。
   */
  const handleTouchStart = useCallback(
    (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;

      const pointerPos = stage.getPointerPosition();
      if (!pointerPos) return;

      const point: Point2D = { x: pointerPos.x, y: pointerPos.y };
      setSelectedPosition(point);
    },
    [setSelectedPosition],
  );

  const handleTouchMove = useCallback(
    (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;

      const pointerPos = stage.getPointerPosition();
      if (!pointerPos) return;

      if (selectedPosition === null) return;

      const dx = pointerPos.x - selectedPosition.x;
      const dy = pointerPos.y - selectedPosition.y;

      const dir = Math.atan2(dx, -dy);

      setSelectedDirection(dir);
    },
    [selectedPosition, setSelectedDirection],
  );

  /**
   * マウス移動時のハンドラ。
   * カーソル位置をストアに反映し、CoordinateDisplayなどで表示する。
   */
  const handleStageMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;

      const pointerPos = stage.getPointerPosition();
      if (!pointerPos) return;

      setCursorPosition({
        x: pointerPos.x,
        y: pointerPos.y,
      });
    },
    [setCursorPosition],
  );

  /**
   * マウスがステージ外に出た時のハンドラ。
   * カーソル位置をnullにリセットして座標表示を消し、
   * クリックで固定した選択座標（マーカー）も解除する。
   */
  const resetSelectedPosition = useCallback(() => {
    setCursorPosition(null);
    setSelectedPosition(null);
    setSelectedDirection(null);
  }, [setCursorPosition, setSelectedPosition, setSelectedDirection]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleStageMouseMove,
    resetSelectedPosition,
  };
}
