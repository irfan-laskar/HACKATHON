# Production Multi-Stage Dockerfile for MarketSphere
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and workspace package files
COPY package.json package-lock.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/

# Install dependencies
RUN npm run postinstall

# Copy all source code
COPY . .

# Build both client and server for production
RUN npm run build

# Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package.json package-lock.json ./
COPY server/package.json ./server/
RUN npm --prefix server install --omit=dev

# Copy build artifacts
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server/uploads ./server/uploads

EXPOSE 5000

CMD ["node", "server/dist/index.js"]
