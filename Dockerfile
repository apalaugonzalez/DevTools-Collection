# Dockerfile
FROM mcr.microsoft.com/playwright:v1.53.1-noble

# Install pnpm
RUN npm install -g pnpm@latest

WORKDIR /app

# Copy lockfiles & install deps + browsers
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile \
    && pnpm exec playwright install chromium

# Copy source & build
COPY . .
RUN pnpm build

# Runtime
ENV NODE_ENV=production
EXPOSE 3000
CMD ["pnpm", "run", "start"]