FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x node_modules/.bin/jest

EXPOSE 3000

CMD ["npm", "start"]