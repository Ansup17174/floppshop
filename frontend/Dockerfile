FROM node:10

WORKDIR /usr/src/frontend/

COPY package.json .
COPY package-lock.json .

ENV REACT_APP_BACKEND_HOST=https://floppshopbackend.herokuapp.com/
ENV PORT=3000

RUN npm install 
COPY . .

CMD ["npm", "start"]