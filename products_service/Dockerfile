
# FROM node:16.15.1-alpine
# COPY . /app
# WORKDIR /app
# COPY package.json/ ./
# COPY package-lock.json ./
# # COPY /Users/bhoyer/certs/dynamic-shark/root.crt ./
# # COPY /../../foo.txt /app/foo.txt
# COPY ./ ./
# RUN npm install
# CMD npm start

FROM node:16.15.1-alpine
COPY . /app
WORKDIR /app
# ENV PORT=81
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY /certs /app/certs
RUN npm install
# CMD node server.js
CMD npm start