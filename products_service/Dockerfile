
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
RUN apk update && apk add bash

# Add 'wait-for-it' to check upstream availability
COPY wait-for-it.sh /usr/local/bin/wait-for-it
RUN ["chmod", "+x", "/usr/local/bin/wait-for-it"]

# Add entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
CMD []