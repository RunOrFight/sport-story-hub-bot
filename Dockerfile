FROM node:18.12.1-alpine as builder

WORKDIR /sport-story-hub

COPY package*.json ./

RUN npm install

COPY . .