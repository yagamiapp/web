FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./build ./build

ENV PORT=3000

EXPOSE 3000

CMD [ "node", "build" ]