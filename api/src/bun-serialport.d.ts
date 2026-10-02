// bun-serialport: 使用する API のみ手動宣言
declare module "bun-serialport" {
  import { EventEmitter } from "node:events";

  export interface SerialPortOptions {
    path: string;
    baudRate: number;
    autoOpen?: boolean;
    dataBits?: number;
    stopBits?: number;
    parity?: "none" | "even" | "odd";
    /**
     * クローズ時に DTR/RTS をドロップするか(termios HUPCL)。
     * ESP/Arduino 系は DTR/RTS のエッジでリセットするため false 推奨。
     */
    hupcl?: boolean;
    /** ハードウェアフロー制御(RTS/CTS)。既定 false。 */
    rtscts?: boolean;
  }

  /** モデム制御線(DTR/RTS)の状態。true=アサート, false=非アサート。 */
  export interface ModemFlags {
    dtr?: boolean;
    rts?: boolean;
  }

  export class SerialPort extends EventEmitter {
    constructor(options: SerialPortOptions);
    readonly isOpen: boolean;
    open(): Promise<void>;
    close(): Promise<void>;
    write(data: string | Uint8Array): Promise<number>;
    flush(): Promise<void>;
    drain(): Promise<void>;
    /** DTR/RTS モデム制御線を設定する。 */
    set(flags: ModemFlags): Promise<void>;
    /** 現在の DTR/RTS/CTS/DSR 等の状態を取得する。 */
    get(): Promise<Record<string, boolean>>;
    pipe<T>(parser: T): T;
    unpipe(parser: unknown): void;
  }

  export interface PortInfo {
    path: string;
    manufacturer?: string;
    serialNumber?: string;
    vendorId?: string;
    productId?: string;
  }

  export function list(): Promise<PortInfo[]>;

  export function readlineParser(options?: { delimiter?: string }): EventEmitter;
  export function delimiterParser(options: { delimiter: string }): EventEmitter;
  export function byteLengthParser(options: { length: number }): EventEmitter;
}
