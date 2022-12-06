FROM node:18

WORKDIR /usr/src/server

RUN mkdir "cache"
COPY dist ./dist
COPY package*.json ./

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start"]