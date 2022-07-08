
# FROM node:16.15.1-alpine
# COPY . /app
# WORKDIR /app
# COPY package.json/ ./
# COPY package-lock.json ./
# COPY ./ ./
# RUN npm install
# CMD npm run start

FROM node:16.15.1-alpine
COPY . /app
WORKDIR /app
COPY package.json/ ./
COPY package-lock.json ./
COPY ./ ./
# RUN npm install --legacy-peer-deps
RUN npm install
CMD npm run start
