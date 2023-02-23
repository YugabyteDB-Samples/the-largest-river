
# FROM node:16.15.1-alpine
# COPY . /app
# WORKDIR /app
# COPY package.json/ ./
# COPY package-lock.json ./
# COPY ./ ./
# RUN npm install
# CMD npm run start

FROM node:16.15.1-alpine

USER node
WORKDIR /app
COPY --chown=node:node package.json .
COPY --chown=node:node package-lock.json .

# RUN npm install --legacy-peer-deps
RUN npm install
COPY --chown=node:node . .

CMD exec npm run start
