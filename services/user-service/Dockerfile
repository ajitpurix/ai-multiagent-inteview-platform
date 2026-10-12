FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY services/user-service/package*.json ./services/user-service/
COPY packages/contracts/package*.json ./packages/contracts/

RUN npm install

COPY packages/contracts ./packages/contracts
COPY services/user-service ./services/user-service

WORKDIR /app/services/user-service
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/services/user-service/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/services/user-service/dist ./dist

EXPOSE 8002

CMD ["node", "dist/index.js"]
