# syntax=docker/dockerfile:1

FROM node:14

RUN apt-get update && apt-get install -y openjdk-8-jdk

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Start our npm script to run RabbitMQ receiver
CMD ["node", "./rabbitmq/receive.js"]