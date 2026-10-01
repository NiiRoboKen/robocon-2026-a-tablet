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
  }

  export class SerialPort extends EventEmitter {
    constructor(options: SerialPortOptions);
    readonly isOpen: boolean;
    open(): Promise<void>;
    close(): Promise<void>;
    write(data: string | Uint8Array): Promise<number>;
    flush(): Promise<void>;
    drain(): Promise<void>;
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
