# The Largest River Bookstore with ReactJS, Node.js and YugabyteDB

This project is a bookstore that leverages multiple database configurations. A control panel contains a map display of database nodes and an x-ray panel with information about database queries and latencies. The application is built on React.js, Node.js and YugabyteDB.

<img width="1242" alt="Screen Shot 2022-11-01 at 7 45 35 PM" src="https://user-images.githubusercontent.com/2041330/199383391-4a7f5d7d-7147-4439-ad39-f2a788e4dde4.png">

## Dev Journal

This is an ongoing project, so, expect the source code and description to change significantly over the time. The development journey is documented in the following series:

[The Largest River Blog](https://dev.to/bretthoyer/series/19070)

- [First Steps to Building a Globally-Distributed Application](https://dev.to/yugabyte/the-largest-river-part-1-first-steps-to-building-a-globally-distributed-application-47ek)
- [Automating Infrastructure For Geo-Distributed Applications With Terraform](https://dev.to/yugabyte/geo-distributed-applications-using-terraforms-infrastructure-automation-3mj3)
- [Deploying a Node.js application across multiple geographies with Terraform and Ansible](https://dev.to/yugabyte/deploying-a-nodejs-application-across-multiple-geographies-with-terraform-and-ansible-20n7)
- [Developing a Node.js Application in a Virtual Private Cloud](https://dev.to/yugabyte/developing-a-nodejs-application-in-a-virtual-private-network-29k7)
- [Managing Your Distributed Node.js Application Environment and Configuration](https://dev.to/yugabyte/managing-your-distributed-nodejs-application-environment-and-configuration-236c)

## Deployment Options

The application can be started in several environments.

| Deployment Type                      | Description                                                                                                                         |
| ------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------- |
| [Gitpod](gitpod_deployment.md)       | A sandboxed environment for running The Largest River in the cloud. Fork this repository to utilize this option with write access.  |
| [Your Laptop](local_deployment.md)   | Deploy the entire app with all the components (React.js, Node.js, YugabyteDB) on your local machine.                                |
| [Google Cloud](gcloud_deployment.md) | Deploy the application in the cloud native way across multiple geographic location using Google Cloud infrastructure and resources. |
