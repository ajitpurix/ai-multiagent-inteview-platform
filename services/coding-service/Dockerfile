FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY services/coding-service/package*.json ./services/coding-service/
COPY packages/contracts/package*.json ./packages/contracts/

RUN npm install

COPY packages/contracts ./packages/contracts
COPY services/coding-service ./services/coding-service

WORKDIR /app/services/coding-service
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Node and python runner environment
RUN apk add --no-cache python3 py3-pip

COPY --from=builder /app/services/coding-service/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/services/coding-service/dist ./dist

EXPOSE 8005

CMD ["node", "dist/index.js"]
