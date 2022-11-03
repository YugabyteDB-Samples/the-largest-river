# Local Application Deployment
![Local Deployment Architecture](https://user-images.githubusercontent.com/2041330/199638551-21a8a8f7-b4f6-4956-9839-dbb37d4b3879.png)

Follow this instruction if you wish to run the entire application with all the components on your local machine using Docker and Docker-Compose.

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
- Install [Docker and Docker Desktop](https://docs.docker.com/get-docker/)

## Architecture
- Frontend - ReactJS
- Backend Services - Node.js
- Reverse Proxy - NGINX
- Database - YugabyteDB
- Infrastructure - Docker / Docker-Compose

## Create Configuration File

Under the `/products_service/config` directory, refer to the file called `example-local-default.json`.

Copy this file in the same directory and rename it `default.json`, adjusting any properties as necessary.

## Run Application Services

This application runs locally via Docker-Compose. In your terminal, run

```
docker compose up
```

to build and run your api services and when everything is up and running visit the app at
[localhost](localhost).

<img width="1572" alt="Screen Shot 2022-11-02 at 7 37 38 PM" src="https://user-images.githubusercontent.com/2041330/199637813-65df20de-20e9-478a-8456-9b2de1bb98cf.png">


You can also view the YugabyteDB UI Console at [localhost:7001](http://localhost:7001).

<img width="1584" alt="Screen Shot 2022-11-02 at 7 36 17 PM" src="https://user-images.githubusercontent.com/2041330/199637751-616d19ff-e474-4d17-956c-fe672c53052c.png">


