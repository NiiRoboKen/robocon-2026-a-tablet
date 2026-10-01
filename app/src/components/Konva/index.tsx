import { useLayoutEffect } from "react";
import { Stage, Layer } from "react-konva";
import { useCanvasInteraction } from "../../hooks/useCanvasInteraction.ts";
import { FieldLayer } from "./Field.tsx";
import { ObjectLayer } from "./Object.tsx";
import { InteractionLayer } from "./InteractionLayer.tsx";
import { useCanvasStore } from "../../stores/useCanvasStore.ts";
import { getConfig } from "../../config/index.ts";

export function Konva() {
  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseOut,
  } = useCanvasInteraction();
  const {
    colorMode,
    pixelFieldSize,
    pixelRatio,
    setPixelFieldSize,
    setPixelScale,
    setPixelRatio,
  } = useCanvasStore();
  const config = getConfig(colorMode);

  useLayoutEffect(() => {
    // iOS Safari などの Canvas 面積上限 (約 16.7M px²) に対する安全マージン
    const MAX_CANVAS_AREA = 16_777_216;

    const scale = (window.innerHeight * 0.9) / config.stage.size.height;
    const displayWidth = config.stage.size.width * scale;
    const displayHeight = config.stage.size.height * scale;

    setPixelScale(scale);
    setPixelFieldSize({
      width: displayWidth,
      height: displayHeight,
    });

    // 内部解像度の上限を stage.size (world 解像度) までとする。
    // 表示解像度に対する world 解像度の比 = 1 / scale。
    // デバイスの devicePixelRatio がこれを超えても意味がないため min を取る。
    let ratio = Math.min(window.devicePixelRatio || 1, 1 / scale);

    // さらに Canvas の総面積が端末上限を超えないよう ratio を抑制する。
    const area = displayWidth * displayHeight * ratio * ratio;
    if (area > MAX_CANVAS_AREA) {
      ratio *= Math.sqrt(MAX_CANVAS_AREA / area);
    }

    setPixelRatio(ratio);
    // 初回ロード時に一度だけ計算する（リサイズ・回転には追従しない）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!pixelFieldSize) return null;

  return (
    <Stage
      width={pixelFieldSize.width}
      height={pixelFieldSize.height}
      pixelRatio={pixelRatio}

      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseOut}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}

      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ border: "1px solid #ccc", cursor: "crosshair" }}
    >
      <Layer listening={false}>
        <FieldLayer />
      </Layer>

      <Layer listening={false}>
        <ObjectLayer />
      </Layer>

      <Layer listening={false}>
        <InteractionLayer />
      </Layer>
    </Stage>
  );
}
