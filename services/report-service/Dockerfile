FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY services/report-service/package*.json ./services/report-service/
COPY packages/contracts/package*.json ./packages/contracts/

RUN npm install

COPY packages/contracts ./packages/contracts
COPY services/report-service ./services/report-service

WORKDIR /app/services/report-service
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/services/report-service/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/services/report-service/dist ./dist

EXPOSE 8004

CMD ["node", "dist/index.js"]
