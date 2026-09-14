FROM node:24-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate --config=prisma7.config.ts

RUN npm run build

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy --config=prisma7.config.ts && npx prisma db seed --config=prisma7.config.ts && npm run start"]