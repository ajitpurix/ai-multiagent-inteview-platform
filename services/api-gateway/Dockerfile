FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY services/api-gateway/package*.json ./services/api-gateway/
COPY packages/contracts/package*.json ./packages/contracts/

RUN npm install

COPY packages/contracts ./packages/contracts
COPY services/api-gateway ./services/api-gateway

WORKDIR /app/services/api-gateway
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/services/api-gateway/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/services/api-gateway/dist ./dist

EXPOSE 8000

CMD ["node", "dist/index.js"]
