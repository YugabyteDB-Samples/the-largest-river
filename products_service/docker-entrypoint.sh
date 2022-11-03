#!/bin/bash
wait-for-it host.docker.internal:5433 --timeout=300 --strict
wait-for-it host.docker.internal:7000 --timeout=300 --strict
sleep 30
[ "$NODE_APP_INSTANCE" = los-angeles ] && npm run seed
npm start