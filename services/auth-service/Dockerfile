FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY services/auth-service/package*.json ./services/auth-service/
COPY packages/contracts/package*.json ./packages/contracts/

RUN npm install

COPY packages/contracts ./packages/contracts
COPY services/auth-service ./services/auth-service

WORKDIR /app/services/auth-service
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/services/auth-service/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/services/auth-service/dist ./dist

EXPOSE 8001

CMD ["node", "dist/index.js"]
