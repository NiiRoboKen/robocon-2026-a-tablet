import { useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { useCanvasInteraction } from "../../hooks/useCanvasInteraction.ts";
import { FieldLayer } from "./Field.tsx";
import { ObjectLayer } from "./Object.tsx";
import { InteractionLayer } from "./InteractionLayer.tsx";
import { useCanvasStore } from "../../stores/useCanvasStore.ts";
import { getConfig } from "../../config/index.ts";

/**
 * メインのKonvaキャンバスコンポーネント。
 * 3つのレイヤーで構成される:
 * 1. GridLayer - 背景のグリッド線（静的、イベント無視）
 * 2. ObjectLayer - サーバーから受信したオブジェクトの描画
 * 3. InteractionLayer - ユーザー操作の視覚フィードバック（選択マーカー、カーソル十字線）
 *
 * キャンバス全体でクリック・マウス移動イベントを捕捉し、
 * useCanvasInteractionフックで処理する。
 */
export function Konva() {
  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleStageMouseMove,
  } = useCanvasInteraction();
  const { colorMode, pixelFieldSize, setPixelFieldSize, setPixelScale } =
    useCanvasStore();
  const config = getConfig(colorMode);

  // ウィンドウサイズに応じてキャンバスの表示スケール・サイズを計算する。
  // レンダリング中ではなくマウント時とリサイズ時に実行し、無限再レンダリングを防ぐ。
  useEffect(() => {
    const updateSize = () => {
      const scale = (window.innerHeight * 0.9) / config.field.size.height;
      setPixelScale(scale);
      setPixelFieldSize({
        width: config.field.size.width * scale,
        height: config.field.size.height * scale,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [window.innerWidth, window.innerHeight]);

  // サイズ計算が完了するまでは描画しない（pixelFieldSizeがnullの間のクラッシュを防ぐ）
  if (!pixelFieldSize) return null;

  return (
    <Stage
      width={pixelFieldSize.width}
      height={pixelFieldSize.height}

      onMouseDown={handleTouchStart}
      onMouseMove={handleStageMouseMove}

      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ border: "1px solid #ccc", cursor: "crosshair" }}
    >
      {/* レイヤー1: グリッド線（静的、再描画頻度低、イベント無視） */}
      <Layer listening={false}>
        <FieldLayer />
      </Layer>

      {/* レイヤー2: WebSocket受信オブジェクトの描画 */}
      <Layer lisening={false}>
        <ObjectLayer />
      </Layer>

      {/* レイヤー3: ユーザー操作の視覚フィードバック */}
      <Layer>
        <InteractionLayer />
      </Layer>
    </Stage>
  );
}
