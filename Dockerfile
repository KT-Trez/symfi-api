FROM node:18

WORKDIR /usr/src/server

COPY dist ./dist
COPY package*.json ./

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start"]