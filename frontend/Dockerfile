FROM node:10

WORKDIR /usr/src/frontend/

COPY package.json .
COPY package-lock.json .

RUN npm install 
COPY . .