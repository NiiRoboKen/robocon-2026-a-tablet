/**
 * bun-serialport 型宣言
 *
 * bun-serialport は型定義を同梱していない純 JS パッケージのため、
 * このプロジェクトで使用する API のみを手動で宣言する。
 * @see https://github.com/fredrikpaulin/bun-serialport
 */
declare module "bun-serialport" {
  import { EventEmitter } from "node:events";

  export interface SerialPortOptions {
    /** デバイスパス（例: '/dev/ttyUSB0'） */
    path: string;
    /** ボーレート（例: 115200） */
    baudRate: number;
    /** true の場合コンストラクタで即座に open する。既定は true。 */
    autoOpen?: boolean;
    /** データビット数 */
    dataBits?: number;
    /** ストップビット数 */
    stopBits?: number;
    /** パリティ */
    parity?: "none" | "even" | "odd";
  }

  export class SerialPort extends EventEmitter {
    constructor(options: SerialPortOptions);
    /** ポートが送受信可能な状態か */
    readonly isOpen: boolean;
    /** ポートを開く */
    open(): Promise<void>;
    /** ポートを閉じる */
    close(): Promise<void>;
    /** データを書き込む（文字列またはバイト列） */
    write(data: string | Uint8Array): Promise<number>;
    /** バッファをフラッシュする */
    flush(): Promise<void>;
    /** 送信完了を待つ */
    drain(): Promise<void>;
    /** パーサーを接続する */
    pipe<T>(parser: T): T;
    /** パーサーの接続を解除する */
    unpipe(parser: unknown): void;
  }

  export interface PortInfo {
    path: string;
    manufacturer?: string;
    serialNumber?: string;
    vendorId?: string;
    productId?: string;
  }

  /** 利用可能なシリアルポートを列挙する */
  export function list(): Promise<PortInfo[]>;

  export function readlineParser(options?: { delimiter?: string }): EventEmitter;
  export function delimiterParser(options: { delimiter: string }): EventEmitter;
  export function byteLengthParser(options: { length: number }): EventEmitter;
}
