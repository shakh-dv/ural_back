# Stage 1: Build the application
FROM node:20-alpine as build-stage

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./

RUN apk add --no-cache openssl
RUN npm install -g pnpm@8.15.2 && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# Stage 2: Production-ready image
FROM node:20-alpine as prod

WORKDIR /app

RUN npm install -g pnpm@8.15.2

COPY --from=build-stage /app/package.json /app/pnpm-lock.yaml /app/.npmrc ./
COPY --from=build-stage /app/dist /app/dist

RUN pnpm install --prod --frozen-lockfile

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
