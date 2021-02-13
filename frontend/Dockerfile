FROM node:10

WORKDIR /usr/src/frontend/

COPY package.json .
COPY package-lock.json .

ENV BACKEND_HOST=https://floppshopp.herokuapp.com
ENV PORT=3000

RUN npm install 
COPY . .

CMD ["npm", "start"]