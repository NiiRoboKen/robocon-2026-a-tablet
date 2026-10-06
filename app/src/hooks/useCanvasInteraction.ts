import { useCallback } from "react";
import type { KonvaEventObject } from "konva/lib/Node";
import { useCanvasStore } from "../stores/useCanvasStore";
import type { Point2D } from "../types/geometry";
import { useRobotStore } from "../stores/useRobotStore";

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
    [setSelectedPosition, setCursorPosition, setIsMouseDown],
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
    },
    [selectedPosition, isMouseDown, setCursorDirection],
  );

  const handleTouchEnd = useCallback(() => {
    setSelectedDirection(cursorDirection);
  }, [setSelectedDirection, cursorDirection]);

  const handleMouseDown = useCallback(
    (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;

      const pointerPos = stage.getPointerPosition();
      if (!pointerPos) return;

      const point: Point2D = { x: pointerPos.x, y: pointerPos.y };
      setSelectedPosition(point);
      setIsMouseDown(true);
    },
    [setSelectedPosition, setIsMouseDown],
  );

  const handleMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage();
      if (!stage) return;

      const pointerPos = stage.getPointerPosition();
      if (!pointerPos) return;

      if (!isMouseDown) {
        const point: Point2D = { x: pointerPos.x, y: pointerPos.y };
        setCursorPosition(point);
        return;
      } else {
        if (!selectedPosition) return;
        const dx = pointerPos.x - selectedPosition.x;
        const dy = pointerPos.y - selectedPosition.y;
        const dir = Math.atan2(-dy, dx);
        setCursorDirection(dir);
      }
    },
    [isMouseDown, setCursorPosition, selectedPosition, setCursorDirection],
  );

  const handleMouseUp = useCallback(() => {
    setSelectedDirection(cursorDirection);
    setIsMouseDown(false);
  }, [setSelectedDirection, cursorDirection, setIsMouseDown]);

  const handleMouseOut = useCallback(() => {
    setCursorPosition(null);
  }, [setCursorPosition]);

  const resetSelectedPosition = useCallback(() => {
    setSelectedPosition(null);
    setSelectedDirection(useRobotStore.getState().position.direction);
    setCursorPosition(null);
    setCursorDirection(useRobotStore.getState().position.direction);
  }, [
    setSelectedPosition,
    setSelectedDirection,
    setCursorPosition,
    setCursorDirection,
  ]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseOut,
    resetSelectedPosition,
  };
}
