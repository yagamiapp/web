FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build

ENV DATABASE_URL="file:/app/src/lib/prisma/db/dev.db"

RUN npx prisma generate

RUN npx prisma migrate deploy

ENV PORT=3000

EXPOSE 3000

CMD [ "node", "build" ]
