# ========================
# Base image
# ========================
FROM node:24-slim AS base
WORKDIR /app

# ========================
# Dependencies stage
# ========================
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# ========================
# Builder stage
# ========================
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build the app (Webpack for stability)
RUN NEXT_SKIP_TURBOPACK=1 npm run build

# ========================
# Production runner
# ========================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Copy static/public files
COPY --from=builder /app/public ./public

# Set up prerender cache directory
RUN mkdir .next \
 && chown nextjs:nodejs .next

# Copy Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
