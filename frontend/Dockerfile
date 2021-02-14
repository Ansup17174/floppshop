FROM node:10

WORKDIR /usr/src/frontend/

COPY package.json .
COPY package-lock.json .

ENV REACT_APP_BACKEND_HOST=http://floppshopbackend.herokuapp.com/
ENV PORT=3000

RUN npm install 
COPY . .

RUN npm run build

CMD ["npm", "start"]