#!/bin/bash
docker rm -f docker-nginx
docker run --name docker-nginx -p 80:80 -d -v $(pwd)/www:/usr/share/nginx/html nginx
