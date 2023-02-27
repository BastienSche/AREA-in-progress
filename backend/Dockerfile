FROM node:alpine

ENV PORT=4000

WORKDIR /app

COPY package*.json ./
COPY src ./src

RUN npm install