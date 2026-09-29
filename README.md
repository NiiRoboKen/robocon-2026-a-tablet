# robocon-2026-a-tablet

ロボコン2026 Aチーム用のタブレット操作アプリケーション。
フィールド上のロボットを操作・監視するためのフロントエンドと、WebSocket 経由で受け取った指示をシリアル通信でロボットへ中継するバックエンドで構成されています。

## 構成

| ディレクトリ | 役割 | 技術スタック |
| --- | --- | --- |
| `app/` | タブレット向けフロントエンド (UI) | React 19 + TypeScript + Vite / Konva / Zustand |
| `api/` | WebSocket サーバー + シリアル通信中継 | Bun + bun-serialport |
| `production/` | 本番用の Dockerfile・nginx 設定 | Docker (multi-stage) + nginx |

### 通信の流れ

```
[ブラウザ/タブレット]
   │  WebSocket (/ws) / HTTP (/api)
   ▼
[api (Bun, :3000)]
   │  シリアル (/dev/ttyUSB0 @ 115200baud)
   ▼
[中継用ESP32]
```

- フロントエンドは `/ws` で WebSocket 接続し、位置情報の更新やコマンドを送信します。
- api はメッセージをシリアルポートへ転送し、`ping` には `pong` を返します。
- シリアルポートは切断時に 3 秒間隔で自動再接続します。

## 前提条件

- [Docker](https://docs.docker.com/get-docker/) / Docker Compose
- ロボットと接続するシリアルデバイス（既定では `/dev/ttyUSB0`）
- ローカルで直接動かす場合: [Node.js 24](https://nodejs.org/) と [Bun](https://bun.com/)

> シリアルデバイスへアクセスするため、compose では `group_add: ["986"]` を指定しています。
> この番号は環境の `dialout`（または該当グループ）の GID に合わせて調整してください。
> 確認例: `getent group dialout`

---

## 開発用コンテナの使い方

ルートの `docker-compose.yml` を使用します。ソースコードをボリュームマウントし、ホットリロードが有効な状態で起動します。

### 起動

```bash
docker compose up
```

- フロントエンド (Vite dev server): <http://localhost:80>
- バックエンド API: <http://localhost:3000>

### 各サービスの挙動

- **app**: `node:24-alpine` 上で `npm run dev`（Vite）を実行。`./app` をマウントし、コード変更が即座に反映されます。
- **api**: `oven/bun:alpine` 上で `bun run src/index.ts` を実行。`./api` をマウントし、`/dev/ttyUSB0` をコンテナへ受け渡します。

### 初回のみ: 依存関係のインストール

`node_modules` はマウントしたホスト側ディレクトリを使うため、初回は依存関係をインストールしておきます。

```bash
# フロントエンド
docker compose run --rm app npm install

# バックエンド
docker compose run --rm api bun install
```

### 停止

```bash
docker compose down
```

### ローカルで直接動かす場合（Docker を使わない）

```bash
# フロントエンド
cd app
npm install
npm run dev

# バックエンド（別ターミナル）
cd api
bun install
bun run dev   # --watch 付きで起動
```

---

## 本番用コンテナの使い方

`production/docker-compose.yml` を使用します。マルチステージビルドで成果物のみを含む軽量イメージを作成し、nginx がフロントエンドの静的ファイル配信と api へのリバースプロキシを担います。

### ビルドと起動

```bash
docker compose -f production/docker-compose.yml up -d --build
```

- 公開ポート: <http://localhost:80>（nginx）
- api は外部公開されず、nginx 経由（`/api`, `/ws`）でのみアクセスされます。

### 構成

- **nginx** (`Dockerfile.nginx`):
  1. Stage 1 で `app` を `npm run build` して静的ファイルを生成
  2. Stage 2 で nginx に成果物を配置し、`production/nginx/default.conf` で以下をルーティング
     - `/` → 静的ファイル（SPA 用に `try_files` でフォールバック）
     - `/api/` → api へプロキシ
     - `/ws` → api へ WebSocket プロキシ
- **api** (`Dockerfile.api`):
  1. Stage 1 で `bun install --frozen-lockfile --production`
  2. Stage 2 で依存関係とソースのみを含む最小ランタイムを構築し `bun run src/index.ts` を実行
  - `/dev/ttyUSB0` をコンテナへ受け渡し
  - `restart: unless-stopped` で自動再起動

### 環境変数（api）

| 変数 | 既定値 | 説明 |
| --- | --- | --- |
| `SERIAL_PATH` | `/dev/ttyUSB0` | 接続するシリアルデバイスのパス |
| `SERIAL_BAUD_RATE` | `115200` | ボーレート |

### ログ確認・停止

```bash
# ログ
docker compose -f production/docker-compose.yml logs -f

# 停止
docker compose -f production/docker-compose.yml down
```

---

## トラブルシューティング

- **シリアルポートが開けない** (`Could not open /dev/ttyUSB0`):
  - デバイスが接続されているか、パスが正しいか確認（`ls -l /dev/ttyUSB*`）
  - `group_add` の GID がホストの該当グループと一致しているか確認
- **フロントエンドから API に繋がらない**:
  - 開発時は Vite の proxy 設定（`app/vite.config.ts`）で `/api`・`/ws` を `api:3000` に転送しています。
  - 本番時は nginx（`production/nginx/default.conf`）が同様の役割を担います。
