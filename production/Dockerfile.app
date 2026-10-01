# ============================================
# 統合イメージ: Bun が静的ファイル配信 + WebSocket + シリアル中継を担う
# ============================================

# ============================================
# Stage 1: フロントエンド (app) をビルド
# ============================================
FROM node:24-alpine AS web-builder

WORKDIR /build

COPY app/package.json app/package-lock.json ./
RUN npm ci

COPY app/ ./
RUN npm run build          # 成果物: /build/dist

# ============================================
# Stage 2: api の依存関係をインストール
# ============================================
FROM oven/bun:alpine AS api-deps

WORKDIR /build

COPY api/package.json api/bun.lock ./
RUN bun install --frozen-lockfile --production

# ============================================
# Stage 3: 本番ランタイム
#   Bun が :3000 で静的配信 + /ws + /health + シリアル中継
# ============================================
FROM oven/bun:alpine AS production

WORKDIR /app

# api 依存とソース
COPY --from=api-deps /build/node_modules ./node_modules
COPY api/src ./src
COPY api/package.json api/tsconfig.json ./

# フロントエンドのビルド成果物を同梱
COPY --from=web-builder /build/dist ./public

# root で実行する（シリアルデバイスへの権限を気にしないため、USER 指定なし = root）。
EXPOSE 3000

ENV PORT=3000
ENV STATIC_DIR=./public

CMD ["bun", "run", "src/index.ts"]
