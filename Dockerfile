FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile


RUN apt update && apt upgrade -y

COPY package.json pnpm-lock.yaml tsconfig.json src ./

RUN pnpm ci && \
    pnpm run build && \
    pnpm prune --production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

USER hono
EXPOSE 7526

CMD ["pnpm", "start"]
