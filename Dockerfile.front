FROM nginx:1.15.12-alpine
COPY frontend/www /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
RUN apk update && apk add git
WORKDIR /usr/share/nginx/html
EXPOSE 80