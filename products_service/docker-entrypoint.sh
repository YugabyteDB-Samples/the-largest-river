#!/bin/bash
until psql -h host.docker.internal -p 5433 -U yugabyte -c 'show server_version' ; do
    echo 'Waiting for yb-tserver (ysql) to be ready ...'; sleep 1
done  2>/dev/null

[ "$NODE_APP_INSTANCE" = los-angeles ] && npm run seed

if [[ $NODE_ENV == development ]]; then
    exec node /app/node_modules/.bin/nodemon index.js
else
    exec node index.js
fi
