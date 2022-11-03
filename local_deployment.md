# Local Application Deployment
![Local Deployment Architecture](https://user-images.githubusercontent.com/2041330/199386937-9c5e8bee-ddbc-48ca-9cdc-913be590c77e.png)
Follow this instruction if you wish to run the entire application with all the components on your local machine.
The instruction is prepared for Unix-based systems. Feel free to submit a pull-request suggesting Windows-specific instructions.

<!-- vscode-markdown-toc -->

- [Local Application Deployment](#local-application-deployment)
  - [Prerequisites](#prerequisites)
  - [Architecture](#architecture)
  - [Create Configuration File](#create-configuration-file)
  - [Seed Database](#seed-database)

<!-- vscode-markdown-toc-config
    numbering=false
    autoSave=true
    /vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

## Prerequisites

- Install Node v16 ([NVM](https://github.com/nvm-sh/nvm) recommended)
- Install [Docker and Docker Desktop](https://docs.docker.com/get-docker/)
- Install [YugabyteDB](https://docs.yugabyte.com/preview/quick-start/#install-yugabytedb) locally
- Start a [Multi-Node Cluster](https://docs.yugabyte.com/preview/quick-start/#start-a-local-multi-node-cluster)

## Architecture

- Frontend - ReactJS
- Backend Services - Node.js
- Reverse Proxy - NGINX
- Database - YugabyteDB
- Infrastructure - Docker / Docker-Compose

## Create Configuration File

Under the `/products_service/config` directory, refer to the file called `example-local-default.json`.

Copy this file in the same directory and rename it `default.json`, adjusting any properties as necessary.

## Seed Database

From the project root, inside of your terminal, run

```
node products_service/seed.js
```

## Run Application Services

This application runs locally via Docker-Compose. In your terminal, run

```
docker compose up
```

to build and run your api services and when everything is up and running visit the app at
[localhost](localhost).
