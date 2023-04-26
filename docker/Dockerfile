FROM node:alpine 

WORKDIR /app

COPY package.json /app

COPY package-lock.json /app

RUN npm ci

RUN npm install

COPY .  /app

EXPOSE 3500

CMD ["npm", "start"]
