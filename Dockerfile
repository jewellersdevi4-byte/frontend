FROM node:24.10.0-bookworm-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json next.config.ts ./
COPY public ./public
COPY app ./app

RUN npm run build

FROM node:24.10.0-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

USER node
EXPOSE 3000

CMD ["npx", "next", "start", "--port", "3000"]
