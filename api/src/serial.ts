import { SerialPort } from "bun-serialport";

const SERIAL_PATH = process.env.SERIAL_PATH ?? "/dev/ttyUSB0";
const SERIAL_BAUD_RATE = Number(process.env.SERIAL_BAUD_RATE ?? "115200");
const RECONNECT_INTERVAL_MS = 3000;

let port: SerialPort | null = null;
let opening = false;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

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

export function isSerialOpen(): boolean {
  return Boolean(port && port.isOpen);
}
