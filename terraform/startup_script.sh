#! /bin/bash

if [ ! -f "/etc/initialized_on_startup" ]; then
    echo "Launching the VM for the first time."

    sudo apt update
    sudo apt-get update
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs
    sudo npm install pm2 -g
    NODE_APP_INSTANCE=$(curl http://metadata.google.internal/computeMetadata/v1/instance/attributes/instance_id -H "Metadata-Flavor: Google")
    echo "NODE_APP_INSTANCE=${NODE_APP_INSTANCE}" | sudo tee -a /etc/environment
    echo $NODE_APP_INSTANCE
    echo "NODE_ENV=production" | sudo tee -a /etc/environment
    source /etc/environment
    sudo touch /etc/initialized_on_startup
else
    # Executed on restarts
    source /etc/environment
    cd /home/products_service && npm run production
fi

# Executed during the first VM start as well as on restarts
# export PORT=$(curl http://metadata.google.internal/computeMetadata/v1/instance/attributes/PORT -H "Metadata-Flavor: Google")
# export DB_URL=$(curl http://metadata.google.internal/computeMetadata/v1/instance/attributes/DB_URL -H "Metadata-Flavor: Google")
# export DB_USER=$(curl http://metadata.google.internal/computeMetadata/v1/instance/attributes/DB_USER -H "Metadata-Flavor: Google")
# export DB_PWD=$(curl http://metadata.google.internal/computeMetadata/v1/instance/attributes/DB_PWD -H "Metadata-Flavor: Google")

# java -jar /opt/messenger/target/geo-distributed-messenger-1.0-SNAPSHOT.jar