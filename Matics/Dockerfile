FROM node:9

RUN mkdir /app
ADD . /app
WORKDIR /app

RUN npm i

CMD ["node","test"]