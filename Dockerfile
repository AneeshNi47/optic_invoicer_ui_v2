# Stage 1: Prepare app source
FROM node:18-alpine AS build-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Stage 2: Final image with nginx and build tools
FROM nginx:alpine
WORKDIR /app
COPY --from=build-env /app /app
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh \
  && apk add --no-cache npm
EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
