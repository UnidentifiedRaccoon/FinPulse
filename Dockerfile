# syntax=docker/dockerfile:1

ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build:container
RUN npm prune --omit=dev

FROM node:${NODE_VERSION}-alpine AS runtime
ENV NODE_ENV=production \
    PORT=8080 \
    FINPULSE_API_HOST=0.0.0.0 \
    FINPULSE_STATIC_ROOT=/app/dist
WORKDIR /app
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/dist-server ./dist-server
COPY --from=build /app/server/db/schema.sql ./server/db/schema.sql
COPY --from=build /app/src/content ./src/content
EXPOSE 8080
CMD ["npm", "run", "start"]
