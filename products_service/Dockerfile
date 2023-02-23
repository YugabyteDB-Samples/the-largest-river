
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

RUN apk update && apk add bash postgresql-client
RUN npm i nodemon -g

USER node
WORKDIR /app

COPY --chown=node:node package.json .
COPY --chown=node:node package-lock.json .

# only needed when connecting to YB Managed nodes
# COPY /certs /app/certs

RUN npm install
COPY --chown=node:node . .

ENTRYPOINT ["/app/docker-entrypoint.sh"]
