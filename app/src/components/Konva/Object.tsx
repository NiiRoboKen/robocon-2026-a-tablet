import { Rect, Circle, Arrow } from "react-konva";
import { useCanvasStore } from "../../stores/useCanvasStore";
import { getConfig } from "../../config";
import { useWebSocketStore } from "../../stores/useWebSocketStore";
import { coordinatesWorldToPixel } from "../../utils/coordinate";

/**
 * WebSocketで受信したロボット状態と、設定ファイルの障害物を描画するレイヤーコンポーネント。
 *
 * 座標系の変換:
 * 設定値（config）は実世界座標（mm）で定義されている。Konvaの描画はピクセル座標のため、
 * ストアの `pixelScale`（1mmあたりのピクセル数）を掛けてピクセル座標へ変換して描画する。
 * 障害物一覧は `getConfig(colorMode)` から参照し、モードに応じた配置を描画する。
 */
export function ObjectLayer() {
  const { colorMode, pixelScale } = useCanvasStore();
  const config = getConfig(colorMode);
  const { robotStatus } = useWebSocketStore();

  const robotPositionPixel = coordinatesWorldToPixel(
    robotStatus.position,
    config.robot.originPosition,
  );
  // ロボット中心のスクリーン座標（マージン加算後、ピクセルスケール適用済み）
  const robotCenter = {
    x: (robotPositionPixel.x + config.stage.margin.left) * pixelScale,
    y: (robotPositionPixel.y + config.stage.margin.top) * pixelScale,
  };
  // Rect と Arrow で共通の回転角（度・Konva rotation と同義＝時計回り正）。
  // これを両方で使うことで、矩形と矢印の向きが必ず一致する。
  const rotationDeg = -(robotStatus.direction + 90);
  const rotationRad = (rotationDeg * Math.PI) / 180;
  const arrowLength = 1000; // 実世界mm。描画時に pixelScale を掛ける

  return (
    <>
      {/* ロボット本体。
          x,y はロボット中心（robotStatus.position）に合わせ、
          offsetX/offsetY に幅・高さの半分を指定することで、
          回転の中心を矩形の中心にする。これにより中心の Circle と常に一致する。 */}
      <Rect
        x={robotCenter.x}
        y={robotCenter.y}
        width={config.robot.size.width * pixelScale}
        height={config.robot.size.height * pixelScale}
        offsetX={config.robot.offset.x * pixelScale}
        offsetY={config.robot.offset.y * pixelScale}
        fill="green"
        stroke="black"
        rotation={rotationDeg}
        strokeWidth={5}
      />
      <Circle x={robotCenter.x} y={robotCenter.y} radius={10} fill="blue" />
      <Arrow
        points={[
          robotCenter.x,
          robotCenter.y,
          robotCenter.x + arrowLength * pixelScale * Math.cos(rotationRad),
          robotCenter.y + arrowLength * pixelScale * Math.sin(rotationRad),
        ]}
        stroke="red"
        strokeWidth={5}
      />

      {/* 障害物一覧（矩形 / 円を shape で出し分け） */}
      {/*{config.obstacles.map((obstacle, index) => {
        if (obstacle.shape === "rect") {
          // position は矩形の中心座標なので、左上原点へ変換して描画する
          return (
            <Rect
              key={`obstacle-rect-${index}`}
              x={(obstacle.position.x - obstacle.size.width / 2 ) * pixelScale}
              y={(obstacle.position.y - obstacle.size.height / 2) * pixelScale}
              width={obstacle.size.width * pixelScale}
              height={obstacle.size.height * pixelScale}
              rotation={obstacle.direction ?? 0}
              fill="gray"
              stroke="black"
              strokeWidth={3}
            />
          );
        }

        // shape === "circle"
        return (
          <Circle
            key={`obstacle-circle-${index}`}
            x={obstacle.position.x * pixelScale}
            y={obstacle.position.y * pixelScale}
            radius={obstacle.radius * pixelScale}
            fill="gray"
            stroke="black"
            strokeWidth={3}
          />
        );
      })}*/}
    </>
  );
}
