variable "instances" {
  type = map(object({
    name = string
    zone = string
    network_ip = string
    metadata = object({ instance_id = string})
    startup_script = string
  }))
  default = {
    "los_angeles" = {
      metadata = {instance_id = "los-angeles"}
      startup_script = "startup_script.sh",
      name = "los-angeles"
      zone = "us-west2-a" // Los Angeles, CA
      network_ip = "10.168.0.2"
    },
    "washington_dc" = {
      metadata = {instance_id = "washington-dc"}
      startup_script = "startup_script.sh",
      name = "washington-dc"
      zone = "us-east4-a" // Ashburn, VA
      network_ip = "10.150.0.2"
    },
    "sao_paulo" = {
      metadata = {instance_id = "sao-paulo"}
      startup_script = "startup_script.sh",
      name = "sao-paulo"
      zone = "southamerica-east1-a" // Sao Paulo
      network_ip = "10.158.0.2"
    },
    "london" = {
      metadata = {instance_id = "london"}
      startup_script = "startup_script.sh",
      name = "london"
      zone = "europe-west2-a" // London, England
      network_ip = "10.154.0.2"
    },
    "mumbai" = {
      metadata = {instance_id = "mumbai" }
      startup_script = "startup_script.sh",
      name = "mumbai"
      zone = "asia-south1-a" // Mumbai, India
      network_ip = "10.160.0.2"
    },
    "sydney" = {
      metadata = {instance_id = "sydney" }
      startup_script = "startup_script.sh",
      name = "sydney"
      zone = "australia-southeast1-a" // Sydney, Australia
      network_ip = "10.152.0.2"
    },
  }
}

variable "ubuntu_2004_sku" {
  type        = string
  description = "SKU for Ubuntu 20.04 LTS"
  default     = "ubuntu-os-cloud/ubuntu-2004-lts"
}

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.24.0"
    }
  }
}

provider "google" {
  credentials = file("./keys/the-largest-river-3514adaf0d57.json")

  project = "the-largest-river"
  region  = "us-central1"
  zone    = "us-central1-c"
}

resource "google_compute_network" "vpc_network" {
  name = "tlr-network"
}

resource "google_compute_firewall" "ssh-rule" {
  name    = "tlr-ssh"
  network = google_compute_network.vpc_network.name
  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
  target_tags   = ["ssh"]
  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_firewall" "allow-http" {
  name    = "tlr-http-entry-point"
  network = google_compute_network.vpc_network.name
  allow {
    protocol = "tcp"
    ports    = ["80"]
  }
  target_tags   = ["http-entry-point"]
  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_firewall" "allow-internal-http" {
  name    = "tlr-http-between-instances"
  network = google_compute_network.vpc_network.name
  allow {
    protocol = "tcp"
    ports    = ["8000"]
  }

  source_ranges = ["10.138.0.0/20"] // this is the source range for us-west1 where our reverse proxy is deployed
}

resource "google_compute_firewall" "allow-internal-icmp" {
  name    = "tlr-icmp"
  network = google_compute_network.vpc_network.name
  allow {
    protocol = "icmp"
  }

  target_tags = ["icmp"]
  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_instance" "vm_instance" {
  for_each = var.instances

  name                      = each.value.name
  machine_type              = "f1-micro"
  zone                      = each.value.zone
  allow_stopping_for_update = true
  metadata = each.value.metadata

  metadata_startup_script = file("${path.module}/${each.value.startup_script}")

  tags = ["ssh", "icmp", "tlr-http-between-instances"]

  boot_disk {
    initialize_params {
      image = var.ubuntu_2004_sku
    }
  }

  
  # service_account {
  #   email = "hoyer-terraform-service-acct@terraform-test-project-353220.iam.gserviceaccount.com"
  #   scopes = [
  #     "https://www.googleapis.com/auth/cloud-platform"
  #   ]
  # }

  network_interface {
    network = google_compute_network.vpc_network.name
    network_ip = each.value.network_ip
    access_config {
    }
  }
}

resource "google_compute_instance" "nginx-entry-point-instance" {
  name                      = "nginx-entry-point"
  machine_type              = "e2-medium"
  zone                      = "us-west1-b"
  allow_stopping_for_update = true

  tags = ["ssh", "icmp", "tlr-http-between-instances", "http-entry-point"]

  boot_disk {
    initialize_params {
      image = var.ubuntu_2004_sku
    }
  }

  
  # service_account {
  #   email = "hoyer-terraform-service-acct@terraform-test-project-353220.iam.gserviceaccount.com"
  #   scopes = [
  #     "https://www.googleapis.com/auth/cloud-platform"
  #   ]
  # }

  network_interface {
    network = google_compute_network.vpc_network.name
    network_ip = "10.138.0.2"
    access_config {
    }
  }
}

resource "google_compute_project_metadata" "ssh_key" {
  metadata = {
    ssh-keys = file("${path.module}/ssh_key_public.txt")
  }
}


