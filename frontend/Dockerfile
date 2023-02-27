# FROM node:14-alpine

# ENV REACT_APP_API_URL=http://localhost:3000
# ENV REACT_APP_WEB_URL=http://localhost:4000
# # ENV PORT=80

# ENV PATH /home/app/node_modules/.bin:$PATH

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["npm", "start"]
FROM node:alpine as node

WORKDIR /app

COPY package*.json .
COPY public ./public
COPY src ./src

RUN npm install