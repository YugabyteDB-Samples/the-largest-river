#!/bin/bash
until psql -h host.docker.internal -p 5433 -U yugabyte -c 'show server_version' ; do
    echo 'Waiting for yb-tserver (ysql) to be ready ...'; sleep 1
done  2>/dev/null

[ "$NODE_APP_INSTANCE" = los-angeles ] && npm run seed
exec npm start
