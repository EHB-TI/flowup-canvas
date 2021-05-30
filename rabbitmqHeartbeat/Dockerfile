# syntax=docker/dockerfile:1

FROM node:14

RUN apt-get update && apt-get install -y openjdk-8-jdk

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install
RUN npm install amqplib
RUN npm install systeminformation
RUN npm install xsd-schema-validator
RUN npm install xml2js
RUN npm install --dotenv-extended
RUN npm install dotenv
# Bundle app source
COPY . .

CMD ["node", "publisher.js"]
