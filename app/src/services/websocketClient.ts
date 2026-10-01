import type { WsMessage, InboundMessage } from "../types/websocket";
// import { buildMessage } from "../utils/messageBuilder";

type MessageHandler = (msg: InboundMessage) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private handlers: Set<MessageHandler> = new Set();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = true;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  // private pingCounter = 0;

  constructor(url: string) {
    this.url = url;
  }

  connect(): void {
    this.shouldReconnect = true;

    try {
      this.ws = new WebSocket(this.url);
    } catch (e) {
      // HTTPS ページから ws:// へ接続しようとした場合など、
      // コンストラクタが例外を投げてアプリ全体がクラッシュするのを防ぐ
      console.error("[WS] 接続の初期化に失敗:", e);
      this.ws = null;
      this.onConnectionChange?.(false);
      if (this.shouldReconnect) {
        this.reconnectTimer = setTimeout(() => this.connect(), 3000);
      }
      return;
    }

    this.ws.onopen = () => {
      console.log("[WS] 接続完了");
      this.onConnectionChange?.(true);
      if (this.pingTimer) clearInterval(this.pingTimer);
      // this.pingTimer = setInterval(() => {
      //   this.pingCounter++;
      //   console.log("[WS] Send ping: ", this.pingCounter);
      //   this.send(buildMessage("ping"));
      // }, 1000);
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as InboundMessage;
        console.log("[WS]");
        this.handlers.forEach((h) => h(msg));
      } catch (e) {
        console.error("[WS] メッセージパースエラー:", e);
      }
    };

    this.ws.onclose = () => {
      console.log("[WS] 切断");
      this.onConnectionChange?.(false);
      if (this.pingTimer) {
        clearInterval(this.pingTimer);
        this.pingTimer = null;
      }
      if (this.shouldReconnect) {
        this.reconnectTimer = setTimeout(() => this.connect(), 3000);
      }
    };

    this.ws.onerror = (error) => {
      console.error("[WS] エラー:", error);
      this.ws?.close();
    };
  }

  send(msg: WsMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
      console.log("[WS]送信完了 : " + msg.type);
    } else {
      console.warn("[WS] 未接続のため送信できません");
    }
  }

  subscribe(handler: MessageHandler): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  onConnectionChange?: (connected: boolean) => void;

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
    this.ws?.close();
    this.ws = null;
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
