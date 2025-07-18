FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build --prod

FROM nginx:alpine AS image
RUN rm -rf /usr/share/nginx/html/*

# Install envsubst (part of gettext)
RUN apk add --no-cache gettext

COPY --from=build /app/dist/book-store/browser /usr/share/nginx/html

# Add custom env template
COPY --from=build /app/src/assets/env.template.json /usr/share/nginx/html/assets/env.template.json

# Add entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
