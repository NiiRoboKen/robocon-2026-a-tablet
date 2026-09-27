import type { WsMessage } from "../types/websocket";
import { buildMessage } from "../utils/messageBuilder";

/**
 * WebSocketメッセージを受信した際のコールバック関数の型。
 * @param msg - パース済みの受信メッセージ
 */
type MessageHandler = (msg: WsMessage) => void;

/**
 * WebSocket通信を管理するクライアントクラス。
 * 接続の確立・切断・自動再接続、メッセージの送受信、
 * サブスクライバパターンによるメッセージハンドリングを提供する。
 *
 * @example
 * ```ts
 * const client = new WebSocketClient('ws://localhost:8080/ws');
 * client.onConnectionChange = (connected) => console.log('接続:', connected);
 * client.connect();
 * const unsubscribe = client.subscribe((msg) => console.log('受信:', msg));
 * client.send('command', { command: 'hello' });
 * ```
 */
export class WebSocketClient {
  /** WebSocketインスタンス。未接続時はnull */
  private ws: WebSocket | null = null;

  /** 接続先のWebSocket URL */
  private url: string;

  /** 登録されたメッセージハンドラの集合（Pub/Subパターン） */
  private handlers: Set<MessageHandler> = new Set();

  /** 自動再接続タイマーのID。再接続待機中でない場合はnull */
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  /** 切断時に自動再接続を試みるかどうかのフラグ */
  private shouldReconnect = true;

  /** ping送信用インターバルタイマーのID。未起動時はnull */
  private pingTimer: ReturnType<typeof setInterval> | null = null;

  private pingCounter = 0;

  /**
   * WebSocketClientのインスタンスを生成する。
   * @param url - 接続先のWebSocket URL（例: 'ws://localhost:8080/ws'）
   */
  constructor(url: string) {
    this.url = url;
  }

  /**
   * WebSocket接続を確立する。
   * 切断時は3秒後に自動再接続を試みる。
   * 明示的に切断する場合は {@link disconnect} を使用する。
   */
  connect(): void {
    this.shouldReconnect = true;
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("[WS] 接続完了");
      this.onConnectionChange?.(true);
      // 既存のpingタイマーが残っていれば止めてから起動する（再接続時の多重起動を防ぐ）
      if (this.pingTimer) clearInterval(this.pingTimer);
      this.pingTimer = setInterval(() => {
        this.pingCounter++;
        console.log("[WS] Send ping: ", this.pingCounter);
        this.send(buildMessage("ping"));
      }, 1000);
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as WsMessage;
        console.log("[WS]");
        // 登録された全ハンドラにメッセージを配信
        this.handlers.forEach((h) => h(msg));
      } catch (e) {
        console.error("[WS] メッセージパースエラー:", e);
      }
    };

    this.ws.onclose = () => {
      console.log("[WS] 切断");
      this.onConnectionChange?.(false);
      // 切断時はpingタイマーを止める（再接続で新たに起動される）
      if (this.pingTimer) {
        clearInterval(this.pingTimer);
        this.pingTimer = null;
      }
      // 自動再接続が有効な場合、3秒後に再試行
      if (this.shouldReconnect) {
        this.reconnectTimer = setTimeout(() => this.connect(), 3000);
      }
    };

    this.ws.onerror = (error) => {
      console.error("[WS] エラー:", error);
      this.ws?.close();
    };
  }

  /**
   * 指定した型とペイロードでメッセージをサーバーに送信する。
   * 接続が確立されていない場合は警告ログを出力し送信しない。
   *
   * @typeParam T - ペイロードの型
   * @param type - メッセージ種別（例: 'command', 'position_update'）
   * @param payload - 送信するデータ本体
   */
  send(msg: WsMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
      console.log("[WS]送信完了 : " + msg.type);
    } else {
      console.warn("[WS] 未接続のため送信できません");
    }
  }

  /**
   * メッセージ受信ハンドラを登録する。
   * 戻り値の関数を呼び出すと登録を解除できる（サブスクライブ解除）。
   *
   * @param handler - メッセージ受信時のコールバック関数
   * @returns 登録解除用の関数
   */
  subscribe(handler: MessageHandler): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  /**
   * 接続状態が変化した際に呼び出されるコールバック。
   * 外部から設定して接続/切断イベントを監視する。
   */
  onConnectionChange?: (connected: boolean) => void;

  /**
   * WebSocket接続を明示的に切断する。
   * 自動再接続を無効化し、再接続タイマーもクリアする。
   */
  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    // pingタイマーを確実に停止する
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
    this.ws?.close();
    this.ws = null;
  }

  /**
   * 現在WebSocketがOPEN状態（接続中）かどうかを返す。
   */
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
