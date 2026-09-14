FROM node:24-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG API_INTERNAL_URL=http://api:4000
ENV API_INTERNAL_URL=$API_INTERNAL_URL

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]