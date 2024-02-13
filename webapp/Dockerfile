FROM node:18.13.0-alpine as client_builder

WORKDIR /app

COPY package.*.json ./
COPY . .

RUN npm install
