FROM node:20

LABEL authors="kttrez"
LABEL name="symfi-api"

WORKDIR /usr/src/app

COPY dist ./dist
COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

CMD ["npm", "run", "start"]
