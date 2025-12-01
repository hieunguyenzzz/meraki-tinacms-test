# Multi-stage Dockerfile for Next.js + TinaCMS
FROM node:18-alpine AS base

# Dependencies stage
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args for TinaCMS Cloud
ARG TINA_CLIENT_ID
ARG TINA_TOKEN

ENV TINA_CLIENT_ID=$TINA_CLIENT_ID
ENV TINA_TOKEN=$TINA_TOKEN
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN yarn build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
