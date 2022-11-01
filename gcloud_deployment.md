# Google Cloud Application Deployment

Follow this instruction if you wish to run the entire application with all the components in the cloud. These instructions are prepared for deployment in the Google Cloud. Feel free to create a pull request for running on other cloud providers.

<!-- vscode-markdown-toc -->

- [Google Cloud Application Deployment](#google-cloud-application-deployment)
  - [Prerequisites](#prerequisites)
  - [Architecture](#architecture)
  - [Create Configuration File](#create-configuration-file)
  - [Create Database Clusters](#create-database-clusters)
  - [Seed Databases](#seed-databases)
  - [Provision Application Infrastructure](#provision-application-infrastructure)
  - [Manually Provision NGINX Server](#manually-provision-nginx-server)
  - [Deploy and Run Application Services](#deploy-and-run-application-services)

<!-- vscode-markdown-toc-config
    numbering=false
    autoSave=true
    /vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

## Prerequisites

- Install [Terraform] (https://www.terraform.io/downloads)
- Install [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html)
- Sign up for [YugabyteDB Managed](https://www.yugabyte.com/managed/)

## Architecture

- Frontend - ReactJS
- Backend Services - Node.js
- Reverse Proxy - NGINX
- Database - YugabyteDB Managed (3 Clusters)
  - Single-region, multi-zone
  - Multi-region, multi-zone w/ Read Replicas
  - Geo-partitioned
- Infrastructure - Google Cloud
  - 1 Ubuntu machine running NGINX
  - 6 Ubuntu machine running Node.js API Servers
    - Located in Los Angeles, Washington, D.C., Sao Paulo, London, Mumbai and Sydney
  - Terraform
  - Ansible

## Create Configuration File

Under the `/products_service/config` directory, refer to the file called `example-google-cloud-default.json`.

Copy this file in the same directory and rename it `default.json`, adjusting any properties as necessary.

## Create Database Clusters

This application utilizes 3 database deployments. Log in to YugabyteDB Managed and create

- 1 single-region, multi-zone cluster with nodes in `us-west2`
- 1 multi-region, multi-zone cluster with nodes in `us-central1`, `us-west1` and `us-east4` with read replicas in `southamerica-east1`, `europe-west2`, `asia-south1` and `australia-southeast1`
- 1 geo-partioned cluster with nodes in `us-west1`, `southamerica-east1`, `europe-west2`, `asia-south1`, `australia-southeast1`

## Seed Databases

The first two databases can be seeded with the same `seed.js` file.

From the project root, inside of your terminal, run:

```
node products_service/seed.js
```

The geo-partioned cluster has a slightly different schema, and utilizes `geoPartioned.sql` and `geoPartitionedTablespaces.sql`.

This deployment requires that you're inside of a peered VPC in Google Cloud to access the database. In order to connect, you'll have to create an SSH tunnel through your Google Cloud entrypoint.

For example:

```
ssh -N -i /path/to/google/private/key -L 5000:YB_MANAGED_DATABASE_HOST:5433 tlr_user@NGINX_PUBLIC_IP
```

Now, port localhost:5000 is securely tunneled to our database. In another terminal window, run the following to configure the database:

```
// Create Tablespaces
/path/to/ysqlsh "host='localhost' port=5000 user=admin dbname='yugabyte' sslmode='require' sslrootcert='/path/to/geoPartioned/root/cert' --file "/Users/bhoyer/Projects/the-largest-river/products_service/geoPartitionedTablespaces.sql"

//Create Tables
/path/to/ysqlsh "host='localhost' port=5000 user=admin dbname='yugabyte' sslmode='require' sslrootcert='/path/to/geoPartioned/root/cert' --file "/Users/bhoyer/Projects/the-largest-river/products_service/geoPartitioned.sql"
```

## Provision Application Infrastructure

Create a project in [Google Cloud](https://cloud.google.com/) named `the-largest-river`. This application utilizes Terraform to deploy the necessary infrastructure for its API services. It would be helpful to familiarize yourself with the [Google Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs/guides/getting_started) for Terraform prior to proceeding.

You'll need to download the JSON key file associated with your account in order to use Terraform.

## Manually Provision NGINX Server

This application uses an NGINX proxy server to send requests to its API services. This currently must be set up manually. In your Google Cloud project, start by provisioning an `Ubuntu, 20.04 LTS` machine.

Once this machine is up and running, SSH in and run the following:

```
sudo apt update
sudo apt install nginx
sudo apt-get install apache2-utils
```

Our NGINX server has two responsibilities. Not only is it our entrypoint to connect to our API services, but it's also used to serve our UI.

Inside of the `tlr-ui` directory, run

```
npm run build

//Using the Google Cloud CLI, copy the contents of the build to the remote server
gcloud compute scp  --zone us-west1-b --project the-largest-river --recurse ./build/* root@nginx-entry-point:/var/www/html
```

Now, inside of our `nginx` directory, run:

```
gcloud compute scp  --zone us-west1-b --project the-largest-river ./default root@nginx-entry-point:/etc/nginx/sites-available/default
```

The NGINX server is ready to be restarted and put to use. Inside of your virtual machine, run:

```
sudo systemctl status nginx
sudo systemctl restart nginx
```

## Deploy and Run Application Services

This application runs in the cloud. Utilize the Ansible scripts to deploy code and run your API servers.

The Ansible playbook will iterate over all internal IP addresses supplied in `inventory.yaml` and deploy code to each by tunneling through our NGINX server. Update the public address of your NGINX server in `inventory.yaml` before running the following:

```
ansible-playbook -i inventory.yaml playbook.yml --private-key=/path/to/ssh/private/key -u tlr_user
```
