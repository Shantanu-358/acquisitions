# ---- Dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app

# bcrypt requires native compilation toolchain
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json* ./
RUN npm ci

# ---- Production ----
FROM node:22-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

CMD ["node", "src/index.js"]
