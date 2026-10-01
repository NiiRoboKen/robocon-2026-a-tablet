import { SerialPort, readlineParser } from "bun-serialport";

const SERIAL_PATH = process.env.SERIAL_PATH ?? "/dev/ttyUSB0";
const SERIAL_BAUD_RATE = Number(process.env.SERIAL_BAUD_RATE ?? "115200");
const RECONNECT_INTERVAL_MS = 3000;

let port: SerialPort | null = null;
let opening = false;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

let lastSentLine: string | null = null;

// 同一メッセージの連続再送回数と、その上限(暴走防止)。
let resendAttempts = 0;
const MAX_RESEND_ATTEMPTS = Number(process.env.SERIAL_MAX_RESEND ?? "3");

export type SerialLineHandler = (line: string) => void;

const lineHandlers = new Set<SerialLineHandler>();

export function onSerialLine(handler: SerialLineHandler): () => void {
  lineHandlers.add(handler);
  return () => {
    lineHandlers.delete(handler);
  };
}

function emitSerialLine(line: string): void {
  const trimmed = line.trim();
  if (trimmed.length === 0) return;
  for (const handler of lineHandlers) {
    try {
      handler(trimmed);
    } catch (err) {
      console.error("[Serial] Line handler threw:", err);
    }
  }
}

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

    const parser = readlineParser({ delimiter: "\n" });
    p.pipe(parser);
    parser.on("data", (chunk: unknown) => {
      const line =
        typeof chunk === "string"
          ? chunk
          : chunk instanceof Uint8Array
            ? new TextDecoder().decode(chunk)
            : String(chunk);
      emitSerialLine(line);
    });

    p.on("close", () => {
      console.warn("[Serial] Port closed");
      p.unpipe(parser);
      port = null;
      scheduleReconnect();
    });
    p.on("error", (err: unknown) => {
      console.error("[Serial] Port error:", err);
      p.unpipe(parser);
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

function scheduleReconnect(): void {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    void connect();
  }, RECONNECT_INTERVAL_MS);
}

export function initSerial(): void {
  void connect();
}

async function writeLine(line: string): Promise<boolean> {
  if (!port || !port.isOpen) {
    console.warn("[Serial] Port not open, dropping message");
    return false;
  }
  try {
    await port.write(line + "\n");
    return true;
  } catch (err) {
    console.error("[Serial] Write failed:", err);
    return false;
  }
}

export async function sendToSerial(data: unknown): Promise<boolean> {
  const json = typeof data === "string" ? data : JSON.stringify(data);
  const ok = await writeLine(json);
  if (ok) {
    // 送信成功した行を再送用に記録し、再送カウンタをリセットする。
    lastSentLine = json;
    resendAttempts = 0;
  }
  return ok;
}

// ESP からの resend_request を受けて直前の行を再送する。
export async function resendLastToSerial(reason?: string): Promise<boolean> {
  if (lastSentLine === null) {
    console.warn("[Serial] resend_request but no previous message to resend");
    return false;
  }
  if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
    console.error(
      `[Serial] resend aborted: reached max attempts (${MAX_RESEND_ATTEMPTS}) for last message`,
    );
    return false;
  }
  resendAttempts += 1;
  console.warn(
    `[Serial] Resending last message (attempt ${resendAttempts}/${MAX_RESEND_ATTEMPTS})` +
      (reason ? ` due to: ${reason}` : ""),
  );
  // writeLine を直接使い lastSentLine/resendAttempts を上書きしない。
  return writeLine(lastSentLine);
}

export function isSerialOpen(): boolean {
  return Boolean(port && port.isOpen);
}
