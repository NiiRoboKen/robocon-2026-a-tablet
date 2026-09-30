import { useCallback } from "react";
import type { KonvaEventObject } from "konva/lib/Node";
import { useCanvasStore } from "../stores/useCanvasStore";
import type { Point2D } from "../types/geometry";
import { useWebSocketStore } from "../stores/useWebSocketStore";

export function useCanvasInteraction() {
  const {
    selectedPosition,
    setSelectedPosition,
    setSelectedDirection,
    cursorDirection,
    setCursorPosition,
    setCursorDirection,
    isMouseDown,
    setIsMouseDown,
  } = useCanvasStore();

  const handleTouchStart = useCallback(
    (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;

      const pointerPos = stage.getPointerPosition();
      if (!pointerPos) return;

      const point: Point2D = { x: pointerPos.x, y: pointerPos.y };
      setSelectedPosition(point);
      setCursorPosition(point);
      setIsMouseDown(true);
    },
    [setSelectedPosition, setCursorPosition],
  );

  const handleTouchMove = useCallback(
    (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (!selectedPosition) return;
      if (!isMouseDown) return;

      const stage = e.target.getStage();
      if (!stage) return;

      const pointerPos = stage.getPointerPosition();
      if (!pointerPos) return;

      const dx = pointerPos.x - selectedPosition.x;
      const dy = pointerPos.y - selectedPosition.y;
      const dir = Math.atan2(-dy, dx);
      setCursorDirection(dir);

      const point: Point2D = { x: pointerPos.x, y: pointerPos.y };
      setCursorPosition(point);
    },
    [selectedPosition, setCursorDirection],
  );

  const handleTouchEnd = useCallback(() => {
    setSelectedDirection(cursorDirection);
  }, [setSelectedDirection, cursorDirection]);

  const handleMouseOver = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;
      if (isMouseDown) return;

      const pointerPos = stage.getPointerPosition();
      if (!pointerPos) return;

      setCursorPosition({
        x: pointerPos.x,
        y: pointerPos.y,
      });
    },
    [setCursorPosition],
  );

  const handleMouseOut = useCallback(() => {
    setCursorPosition(null);
  }, [setCursorPosition]);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
  }, [setIsMouseDown]);

  const resetSelectedPosition = useCallback(() => {
    setSelectedPosition(null);
    setSelectedDirection(useWebSocketStore.getState().robotStatus.direction);
    setCursorPosition(null);
    setCursorDirection(useWebSocketStore.getState().robotStatus.direction);
  }, [setCursorPosition, setSelectedPosition, setSelectedDirection]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseOver,
    handleMouseOut,
    handleMouseUp,
    resetSelectedPosition,
  };
}
