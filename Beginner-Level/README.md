# 💳 Paytm Wallet — Full-Stack DevOps Project

A production-style full-stack **Paytm Wallet** application containerized with Docker, orchestrated via Kubernetes on Minikube, and deployed on **AWS EC2**.

---

## 📌 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Docker Setup](#2-docker-setup)
  - [3. Minikube & Kubernetes Setup](#3-minikube--kubernetes-setup)
  - [4. AWS EC2 Deployment](#4-aws-ec2-deployment)
- [Kubernetes Resources](#kubernetes-resources)
- [Docker Hub](#docker-hub)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## 📖 Project Overview

This project demonstrates a complete **DevOps pipeline** for a Paytm-like wallet application:

- React frontend served via a containerized pod
- Node.js + Express REST API backend
- MySQL database for persistent storage
- Docker images pushed to Docker Hub
- Kubernetes Deployments and NodePort Services managed with Minikube
- Application hosted on an AWS EC2 instance

---

## 🛠 Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | React.js, CSS                       |
| Backend      | Node.js, Express.js                 |
| Database     | MySQL                               |
| Container    | Docker, Docker Hub                  |
| Orchestration| Kubernetes, Minikube                |
| Cloud        | AWS EC2                             |
| Version Control | GitHub                           |

---

## 🏗 Project Architecture

```
Browser
   │
   ▼
┌─────────────────────┐
│   Frontend Pod      │  ← React.js (NodePort Service)
│   (React.js)        │
└─────────┬───────────┘
          │ HTTP Request
          ▼
┌─────────────────────┐
│   Backend Pod       │  ← Node.js + Express (NodePort Service)
│  (Node.js/Express)  │
└─────────┬───────────┘
          │ SQL Query
          ▼
┌─────────────────────┐
│   MySQL Database    │  ← Persistent MySQL Pod
└─────────────────────┘
```

All pods run inside a **Minikube cluster** on an **AWS EC2** instance.

---

## ✨ Features

- 👤 Display wallet users
- 💰 Display wallet balances
- 🔗 Full-stack frontend ↔ backend ↔ database integration
- 🐳 Docker containerization with versioned images
- ☸️ Kubernetes Deployments and Services
- 🌐 NodePort exposure for external access
- ☁️ Hosted on AWS EC2

---

## ✅ Prerequisites

Make sure the following are installed before getting started:

- [Docker](https://docs.docker.com/get-docker/) & Docker Hub account
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Node.js](https://nodejs.org/) (v18+)
- [MySQL](https://www.mysql.com/)
- AWS EC2 instance (Ubuntu recommended)
- [Git](https://git-scm.com/)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Priyanka6304/paytm-wallet-devops.git
cd paytm-wallet-devops
```

---

### 2. Docker Setup

#### Build & Push Frontend Image

```bash
cd frontend
docker build -t priyankadevops6304/paytm-frontend:v1 .
docker push priyankadevops6304/paytm-frontend:v1
```

#### Build & Push Backend Image

```bash
cd ../backend
docker build -t priyankadevops6304/paytm-backend:v1 .
docker push priyankadevops6304/paytm-backend:v1
```

#### Run Locally with Docker Compose (optional)

```bash
docker-compose up --build
```

---

### 3. Minikube & Kubernetes Setup

#### Start Minikube

```bash
minikube start
```

#### Apply Kubernetes Manifests

```bash
# MySQL
kubectl apply -f k8s/mysql-deployment.yaml
kubectl apply -f k8s/mysql-service.yaml

# Backend
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

# Frontend
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

#### Verify Pods and Services

```bash
kubectl get pods
kubectl get services
```

#### Access the Frontend

```bash
minikube service frontend-service --url
```

Open the returned URL in your browser.

---

### 4. AWS EC2 Deployment

#### Step 1 — Launch EC2 Instance

- AMI: Ubuntu 22.04 LTS
- Instance type: `t2.medium` (recommended for Minikube)
- Open inbound ports: `22` (SSH), `30000–32767` (NodePort range), `80`, `443`

#### Step 2 — Install Dependencies on EC2

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install docker.io -y
sudo usermod -aG docker $USER

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start Minikube with Docker driver
minikube start --driver=docker
```

#### Step 3 — Deploy on EC2

```bash
git clone https://github.com/Priyanka6304/paytm-wallet-devops.git
cd paytm-wallet-devops
kubectl apply -f k8s/
```

#### Step 4 — Access the App

```bash
minikube service frontend-service --url
```

Or access via `http://<EC2-Public-IP>:<NodePort>`.

---

## ☸️ Kubernetes Resources

| Resource                  | Kind        | Description                        |
|---------------------------|-------------|------------------------------------|
| `mysql-deployment.yaml`   | Deployment  | MySQL database pod                 |
| `mysql-service.yaml`      | Service     | ClusterIP for internal DB access   |
| `backend-deployment.yaml` | Deployment  | Node.js/Express backend pod        |
| `backend-service.yaml`    | Service     | NodePort for backend API           |
| `frontend-deployment.yaml`| Deployment  | React frontend pod                 |
| `frontend-service.yaml`   | Service     | NodePort for frontend access       |

---

## 🐳 Docker Hub

Images are hosted on Docker Hub:

| Image                                            | Tag  |
|--------------------------------------------------|------|
| `priyankadevops6304/paytm-frontend`       | `v1` |
| `priyankadevops6304/paytm-backend`        | `v1` |


---

## 📸 Screenshots

Screenshots of the running application, Kubernetes pods, and AWS EC2 console are available in the [`screenshots/`](./screenshots/) folder of this repository.

---

## 🚀 Future Improvements

Here are the planned enhancements for upcoming versions of this project:

### ⚙️ CI/CD Pipeline
- Automate Docker image builds and Kubernetes deployments using **GitHub Actions**
- Trigger pipeline on every `git push` to main branch
- Auto push updated images to Docker Hub on successful build

### 📦 Helm Charts
- Package all Kubernetes manifests into reusable **Helm Charts**
- Support parameterized deployments across environments (dev, staging, prod)
- Simplify upgrades and rollbacks using `helm upgrade` and `helm rollback`

### 📊 Monitoring & Logging
- Integrate **Prometheus** for metrics collection from all pods
- Set up **Grafana** dashboards for real-time visualization of CPU, memory, and request metrics
- Add **ELK Stack** (Elasticsearch, Logstash, Kibana) for centralized log management

### 🔒 HTTPS / SSL with Ingress
- Replace NodePort services with a **Kubernetes Ingress Controller** (NGINX)
- Configure **SSL/TLS certificates** using Cert-Manager and Let's Encrypt
- Route traffic via domain names instead of raw IP:Port

### 📈 Horizontal Pod Autoscaling (HPA)
- Configure **HPA** for frontend and backend pods based on CPU/memory thresholds
- Automatically scale up pods under high load and scale down during low traffic

### 🔐 Security Enhancements
- Implement **Role-Based Access Control (RBAC)** for Kubernetes resources
- Store secrets securely using **Kubernetes Secrets** or **AWS Secrets Manager**
- Add **Network Policies** to restrict inter-pod communication

### 🌐 Multi-Node Kubernetes Cluster
- Migrate from single-node Minikube to a **multi-node Kubernetes cluster** on AWS (EKS)
- Distribute workloads across nodes for high availability and fault tolerance

### 🗄️ Managed Database
- Replace the MySQL pod with **AWS RDS (Relational Database Service)**
- Enable automated backups, failover, and read replicas for production-grade reliability

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built with ❤️ | Docker 🐳 | Kubernetes ☸️ | AWS ☁️</p>
</div>
