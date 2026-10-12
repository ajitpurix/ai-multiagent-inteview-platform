FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/contracts/package*.json ./packages/contracts/

RUN npm install

COPY packages/contracts ./packages/contracts
COPY apps/web ./apps/web

WORKDIR /app/apps/web
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/web/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public

EXPOSE 3000

CMD ["npm", "start"]
