import { useEffect } from "react";
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
    handleMouseOver,
    handleMouseOut
  } = useCanvasInteraction();
  const { colorMode, pixelFieldSize, setPixelFieldSize, setPixelScale } =
    useCanvasStore();
  const config = getConfig(colorMode);

  useEffect(() => {
    const updateSize = () => {
      const scale = (window.innerHeight * 0.9) / config.stage.size.height;
      setPixelScale(scale);
      setPixelFieldSize({
        width: config.stage.size.width * scale,
        height: config.stage.size.height * scale,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [window.innerWidth, window.innerHeight]);

  if (!pixelFieldSize) return null;

  return (
    <Stage
      width={pixelFieldSize.width}
      height={pixelFieldSize.height}

      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onMouseDown={handleTouchStart}
      // onMouseMove={handleStageMouseMove}

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

      <Layer>
        <InteractionLayer />
      </Layer>
    </Stage>
  );
}
