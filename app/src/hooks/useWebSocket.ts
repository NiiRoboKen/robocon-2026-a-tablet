import { useEffect, useRef } from "react";
import { WebSocketClient } from "../services/websocketClient";
import { useWebSocketStore } from "../stores/useWebSocketStore";
import { useCanvasStore } from "../stores/useCanvasStore";
import type {
  WsMessage,
  ObjectSyncPayload,
  StatusPayload,
} from "../types/websocket";

/**
 * WebSocket接続のライフサイクルを管理するカスタムフック。
 * コンポーネントのマウント時に接続を確立し、受信メッセージを種別ごとにストアへ反映する。
 * アンマウント時に自動的に接続を切断する。
 *
 * @returns WebSocketClientインスタンスへのref（送信操作に使用可能）
 *
 * @example
 * ```tsx
 * function App() {
 *   const wsClient = useWebSocket();
 *   // wsClient.current?.send('command', { command: 'hello' }) で送信可能
 * }
 * ```
 */
export function useWebSocket() {
  /** WebSocketClientインスタンスを保持するref。レンダリングを跨いで接続を維持する */
  const clientRef = useRef<WebSocketClient | null>(null);
  const { setConnected, setLastMessage, setRobotStatus } = useWebSocketStore();
  const { setObjects } = useCanvasStore();

  useEffect(() => {
    // 現在のページプロトコルに応じてws:/wss:を選択
    // const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // const url = `${protocol}//${window.location.host}/ws`;
    const url = `ws://${window.location.host}/ws`;

    const client = new WebSocketClient(url);
    clientRef.current = client;

    // 接続状態変化をストアに反映するコールバック
    client.onConnectionChange = setConnected;

    // メッセージ受信時の処理を登録
    const unsubscribe = client.subscribe((msg: WsMessage) => {
      setLastMessage(msg);

      switch (msg.type) {
        case "pong": {
          console.log("[WS] Pong received:", msg.timestamp);
          break;
        }
        case "object_sync": {
          // フィールド上のオブジェクト一覧を更新
          const payload = msg.payload as ObjectSyncPayload;
          setObjects(payload.objects);
          break;
        }
        case "status": {
          // ロボットのステータス情報を更新
          const payload = msg.payload as StatusPayload;
          setRobotStatus(payload);
          break;
        }
      }
    });

    client.connect();

    // クリーンアップ: サブスクリプション解除と接続切断
    return () => {
      unsubscribe();
      client.disconnect();
    };
  }, [setConnected, setLastMessage, setRobotStatus, setObjects]);

  return clientRef;
}
