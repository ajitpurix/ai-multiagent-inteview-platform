FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY services/interview-service/package*.json ./services/interview-service/
COPY packages/contracts/package*.json ./packages/contracts/

RUN npm install

COPY packages/contracts ./packages/contracts
COPY services/interview-service ./services/interview-service

WORKDIR /app/services/interview-service
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/services/interview-service/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/services/interview-service/dist ./dist

EXPOSE 8003

CMD ["node", "dist/index.js"]
