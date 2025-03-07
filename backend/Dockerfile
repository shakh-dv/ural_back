# Stage 1: Build the application
FROM node:20-alpine as build-stage

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./

# Установите OpenSSL
RUN apk add --no-cache openssl

# Установите pnpm и зависимости
RUN npm install -g pnpm@8.15.2 && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Stage 2: Production-ready image
FROM node:20-alpine as prod

WORKDIR /app

# Установите OpenSSL
RUN apk add --no-cache openssl

# Установите pnpm
RUN npm install -g pnpm@8.15.2

COPY --from=build-stage /app /app

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
