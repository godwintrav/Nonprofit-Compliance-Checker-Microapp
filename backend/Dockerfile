FROM node:22-alpine

WORKDIR /usr/app


COPY package*.json ./


RUN npm install


COPY . .


RUN npm run build


EXPOSE 3000


CMD ["npm", "run", "start:prod"]
