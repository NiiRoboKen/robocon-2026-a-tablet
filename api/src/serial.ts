/**
 * シリアル通信モジュール
 *
 * WebSocket で受信したメッセージを /dev/ttyUSB0 へ JSON データとして転送する。
 * bun-serialport (bun:ffi ベース) を使用しているため、ネイティブビルド不要。
 *
 * デバイスが存在しない環境（開発 PC など）でもサーバーが落ちないよう、
 * 接続失敗時はログを出して無効化し、一定間隔で再接続を試みる。
 */

import { SerialPort } from "bun-serialport";

/** シリアルポートのデバイスパス（環境変数で上書き可能） */
const SERIAL_PATH = process.env.SERIAL_PATH ?? "/dev/ttyUSB0";

/** ボーレート（環境変数で上書き可能） */
const SERIAL_BAUD_RATE = Number(process.env.SERIAL_BAUD_RATE ?? "115200");

/** 再接続を試みる間隔（ミリ秒） */
const RECONNECT_INTERVAL_MS = 3000;

let port: SerialPort | null = null;
let opening = false;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * シリアルポートへの接続を試みる。
 * 失敗しても例外を投げず、再接続タイマーをセットする。
 */
async function connect(): Promise<void> {
  if (opening || (port && port.isOpen)) return;
  opening = true;

  try {
    const p = new SerialPort({
      path: SERIAL_PATH,
      baudRate: SERIAL_BAUD_RATE,
      autoOpen: true,
    });

    await p.open();
    port = p;
    console.log(
      `[Serial] Connected to ${SERIAL_PATH} @ ${SERIAL_BAUD_RATE} baud`,
    );

    // 切断を検知したら再接続を試みる
    p.on("close", () => {
      console.warn("[Serial] Port closed");
      port = null;
      scheduleReconnect();
    });
    p.on("error", (err: unknown) => {
      console.error("[Serial] Port error:", err);
      port = null;
      scheduleReconnect();
    });
  } catch (err) {
    console.warn(
      `[Serial] Could not open ${SERIAL_PATH}: ${
        err instanceof Error ? err.message : String(err)
      }. Retrying in ${RECONNECT_INTERVAL_MS}ms.`,
    );
    port = null;
    scheduleReconnect();
  } finally {
    opening = false;
  }
}

/** 再接続タイマーをセットする（多重登録を防ぐ）。 */
function scheduleReconnect(): void {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    void connect();
  }, RECONNECT_INTERVAL_MS);
}

/** シリアル通信を初期化する。サーバー起動時に一度だけ呼び出す。 */
export function initSerial(): void {
  void connect();
}

/**
 * データを JSON 文字列としてシリアルポートへ送信する。
 * 末尾に改行 (\n) を付与し、受信側でメッセージ境界を判定できるようにする。
 *
 * @param data - 送信するデータ（オブジェクトは JSON 文字列化される）
 * @returns 送信に成功したら true、ポート未接続などで送信できなければ false
 */
export async function sendToSerial(data: unknown): Promise<boolean> {
  if (!port || !port.isOpen) {
    console.warn("[Serial] Port not open, dropping message");
    return false;
  }

  try {
    const json = typeof data === "string" ? data : JSON.stringify(data);
    await port.write(json + "\n");
    return true;
  } catch (err) {
    console.error("[Serial] Write failed:", err);
    return false;
  }
}

/** シリアルポートが送信可能な状態か。 */
export function isSerialOpen(): boolean {
  return Boolean(port && port.isOpen);
}
