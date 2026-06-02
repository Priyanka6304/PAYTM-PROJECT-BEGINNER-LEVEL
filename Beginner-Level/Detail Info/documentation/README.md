# PAYTM FULL STACK KUBERNETES PROJECT ON AWS KOPS

## COMPLETE STEP BY STEP REAL TIME DOCUMENTATION

Author: Self Hands-on Project Documentation
Platform: AWS + Kubernetes + KOPS + Docker + ReactJS + NodeJS + MySQL
Tool Used: MobaXterm
Cloud: AWS EC2
Kubernetes Type: Full Stack Kubernetes Cluster using KOPS

---

# PROJECT OVERVIEW

This project is a complete Full Stack Kubernetes deployment project using:

* ReactJS Frontend
* NodeJS Backend
* MySQL Database StatefulSet
* Kubernetes Services
* Ingress Controller
* AWS Load Balancer
* Persistent Volume
* KOPS Kubernetes Cluster
* AWS EC2
* DockerHub

The project is designed as a Paytm-like Application.

This documentation is written completely in beginner-friendly format so that even a fresher can setup the entire project from scratch.

---

# FINAL PROJECT ARCHITECTURE

```text

                USERS
                  |
                  |
           AWS LOAD BALANCER
                  |
                  |
          NGINX INGRESS CONTROLLER
             /               \
            /                 \
           /                   \
   FRONTEND SERVICE        BACKEND SERVICE
          |                      |
          |                      |
    REACT FRONTEND         NODEJS BACKEND
          |                      |
          |                      |
          ------------------------
                     |
                     |
             MYSQL STATEFULSET
                     |
                     |
              PERSISTENT VOLUME
                     |
                     |
                  AWS EBS

```

---

# TECHNOLOGIES USED

| Component          | Technology       |
| ------------------ | ---------------- |
| Cloud              | AWS              |
| Kubernetes Setup   | KOPS             |
| Frontend           | ReactJS          |
| Backend            | NodeJS + Express |
| Database           | MySQL            |
| Containerization   | Docker           |
| Ingress            | NGINX Ingress    |
| Persistent Storage | EBS Volume       |
| Namespace          | production       |
| Tool               | MobaXterm        |

---

# COMPLETE FLOW OF APPLICATION

1. User opens browser
2. Request goes to AWS Load Balancer
3. Load Balancer forwards traffic to Ingress Controller
4. Ingress routes request
5. Frontend request goes to ReactJS Service
6. API request goes to Backend Service
7. Backend connects to MySQL
8. MySQL stores payment/user data
9. Response returns back
10. Frontend displays data

---

# IMPORTANT REAL TIME PROJECT STRUCTURE

```text
paytm-project/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   └── routes/
│
├── kubernetes/
│   ├── namespace.yml
│   ├── configmap.yml
│   ├── secret.yml
│   ├── mysql-statefulset.yml
│   ├── backend-deployment.yml
│   ├── backend-service.yml
│   ├── frontend-deployment.yml
│   ├── frontend-service.yml
│   └── ingress.yml
│
└── README.md

```

---

# STEP 1 — CREATE EC2 INSTANCE

Login to AWS Console.

Launch EC2 Instance.

## EC2 Configuration

| Option         | Value                                |
| -------------- | ------------------------------------ |
| AMI            | Amazon Linux 2023                    |
| Instance Type  | t3.micro                             |
| Name           | kops                                 |
| Storage        | 20 GB                                |
| Security Group | Allow All Traffic (Learning Purpose) |
| IAM Role       | AdministratorAccess                  |

---

# STEP 2 — CONNECT EC2 USING MOBAXTERM

Open MobaXterm.

Click:

Session → SSH

Enter:

```bash
Public IP of EC2
```

Username:

```bash
ec2-user
```

Connect using pem key.

---

# STEP 3 — SWITCH TO ROOT USER

```bash
sudo su -
```

---

# STEP 4 — UPDATE SERVER

```bash
yum update -y
```

---

# STEP 5 — CONFIGURE PATH

```bash
vi .bashrc
```

Add:

```bash
export PATH=$PATH:/usr/local/bin/
```

Save and run:

```bash
source .bashrc
```

---

# STEP 6 — GENERATE SSH KEY

```bash
ssh-keygen
```

Press Enter for all.

Copy public key:

```bash
cp /root/.ssh/id_rsa.pub my-keypair.pub
```

Give permission:

```bash
chmod 777 my-keypair.pub
```

---

# STEP 7 — CREATE KOPS INSTALLATION SCRIPT

```bash
vi kops.sh
```

Paste:

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

wget https://github.com/kubernetes/kops/releases/download/v1.32.0/kops-linux-amd64

chmod +x kops-linux-amd64 kubectl

mv kubectl /usr/local/bin/kubectl

mv kops-linux-amd64 /usr/local/bin/kops

aws s3api create-bucket --bucket paytm-kops-state-store6304.k8s.local --region ap-south-1 --create-bucket-configuration LocationConstraint=ap-south-1

aws s3api put-bucket-versioning --bucket paytm-kops-state-store6304.k8s.local --region ap-south-1 --versioning-configuration Status=Enabled

export KOPS_STATE_STORE=s3://paytm-kops-state-store6304.k8s.local

kops create cluster \
--name=paytm.k8s.local \
--zones=ap-south-1a,ap-south-1b \
--control-plane-count=1 \
--control-plane-size=c7i-flex.large \
--node-count=2 \
--node-size=t3.small \
--node-volume-size=40 \
--control-plane-volume-size=40 \
--ssh-public-key=my-keypair.pub \
--image=ami-02d26659fd82cf299 \
--networking=calico

kops update cluster --name paytm.k8s.local --yes --admin
```

Save file.

---

# STEP 8 — EXECUTE KOPS SCRIPT

```bash
sh kops.sh
```

---

# STEP 9 — EXPORT KOPS STATE STORE

```bash
export KOPS_STATE_STORE=s3://paytm-kops-state-store6304.k8s.local
```

---

# STEP 10 — VALIDATE CLUSTER

```bash
kops validate cluster --wait 10m
```

---

# STEP 11 — VERIFY NODES

```bash
kops get cluster
```

```bash
kubectl get nodes
```

```bash
kubectl get nodes -o wide
```

Expected:

* 1 Master Node
* 2 Worker Nodes

---

# STEP 12 — CREATE NAMESPACE

```bash
vi namespace.yml
```

```yaml
apiVersion: v1
kind: Namespace

metadata:
  name: production
```

Apply:

```bash
kubectl apply -f namespace.yml
```

---

# STEP 13 — CREATE CONFIGMAP

```bash
vi configmap.yml
```

```yaml
apiVersion: v1
kind: ConfigMap

metadata:
  name: app-config
  namespace: production

data:
  DB_HOST: mysql-headless
  DB_NAME: paytm
  APP_ENV: production
```

Apply:

```bash
kubectl apply -f configmap.yml
```

---

# STEP 14 — CREATE SECRET

```bash
vi secret.yml
```

Encode password:

```bash
echo -n 'paytm123' | base64
```

Example Output:

```bash
cGF5dG0xMjM=
```

Now create secret:

```yaml
apiVersion: v1
kind: Secret

metadata:
  name: mysql-secret
  namespace: production

type: Opaque

data:
  MYSQL_ROOT_PASSWORD: cGF5dG0xMjM=
```

Apply:

```bash
kubectl apply -f secret.yml
```

---

# STEP 15 — CREATE MYSQL STATEFULSET

```bash
vi mysql-statefulset.yml
```

```yaml
apiVersion: apps/v1
kind: StatefulSet

metadata:
  name: mysql
  namespace: production

spec:
  serviceName: mysql-headless
  replicas: 1

  selector:
    matchLabels:
      app: mysql

  template:
    metadata:
      labels:
        app: mysql

    spec:
      containers:
      - name: mysql

        image: mysql:8.0

        ports:
        - containerPort: 3306

        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: MYSQL_ROOT_PASSWORD

        volumeMounts:
        - name: mysql-storage
          mountPath: /var/lib/mysql

  volumeClaimTemplates:
  - metadata:
      name: mysql-storage

    spec:
      accessModes:
      - ReadWriteOnce

      resources:
        requests:
          storage: 5Gi
```

Apply:

```bash
kubectl apply -f mysql-statefulset.yml
```

---

# STEP 16 — CREATE MYSQL HEADLESS SERVICE

```bash
vi mysql-headless.yml
```

```yaml
apiVersion: v1
kind: Service

metadata:
  name: mysql-headless
  namespace: production

spec:
  clusterIP: None

  selector:
    app: mysql

  ports:
  - port: 3306
```

Apply:

```bash
kubectl apply -f mysql-headless.yml
```

---

# STEP 17 — VERIFY MYSQL POD

```bash
kubectl get pods -n production
```

---

# STEP 18 — LOGIN INTO MYSQL POD

```bash
kubectl exec -it mysql-0 -n production -- bash
```

```bash
mysql -u root -p
```

Password:

```bash
paytm123
```

---

# STEP 19 — CREATE PAYTM DATABASE

```sql
CREATE DATABASE paytm;
```

```sql
USE paytm;
```

---

# STEP 20 — CREATE USERS TABLE

```sql
CREATE TABLE users (
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100),
 email VARCHAR(100),
 wallet_balance INT
);
```

---

# STEP 21 — INSERT SAMPLE DATA

```sql
INSERT INTO users(name,email,wallet_balance)
VALUES
('Rahul','rahul@gmail.com',5000),
('Sneha','sneha@gmail.com',7000),
('Arjun','arjun@gmail.com',9000);
```

Check data:

```sql
SELECT * FROM users;
```

---

# STEP 22 — CREATE NODEJS BACKEND

```bash
mkdir backend
cd backend
```

---

# STEP 23 — CREATE PACKAGE.JSON

```bash
vi package.json
```

```json
{
  "name": "paytm-backend",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "cors": "^2.8.5"
  }
}
```

---

# STEP 24 — CREATE SERVER.JS

```bash
vi server.js
```

```javascript
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.get('/api/users', (req, res) => {

  connection.query(
    'SELECT * FROM users',
    (err, results) => {

      if (err) {
        res.status(500).send(err);
      } else {
        res.json(results);
      }
    }
  );
});

app.listen(3000, () => {
  console.log('Paytm Backend Running');
});
```

---

# STEP 25 — CREATE BACKEND DOCKERFILE

```bash
vi Dockerfile
```

```dockerfile
FROM node:18

WORKDIR /app

COPY package.json .

RUN npm install

COPY server.js .

EXPOSE 3000

CMD ["node", "server.js"]
```

---

# STEP 26 — BUILD BACKEND IMAGE

```bash
docker build -t paytm-backend:v1 .
```

---

# STEP 27 — PUSH IMAGE TO DOCKERHUB

```bash
docker tag paytm-backend:v1 yourdockerhub/paytm-backend:v1
```

```bash
docker login
```

```bash
docker push yourdockerhub/paytm-backend:v1
```

---

# STEP 28 — CREATE BACKEND DEPLOYMENT

```bash
vi backend-deployment.yml
```

```yaml
apiVersion: apps/v1
kind: Deployment

metadata:
  name: backend
  namespace: production

spec:
  replicas: 2

  selector:
    matchLabels:
      app: backend

  template:
    metadata:
      labels:
        app: backend

    spec:
      containers:
      - name: backend

        image: yourdockerhub/paytm-backend:v1

        ports:
        - containerPort: 3000

        env:
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: DB_HOST

        - name: DB_NAME
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: DB_NAME

        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: MYSQL_ROOT_PASSWORD
```

Apply:

```bash
kubectl apply -f backend-deployment.yml
```

---

# STEP 29 — CREATE BACKEND SERVICE

```bash
vi backend-service.yml
```

```yaml
apiVersion: v1
kind: Service

metadata:
  name: backend-service
  namespace: production

spec:
  selector:
    app: backend

  ports:
  - port: 80
    targetPort: 3000
```

Apply:

```bash
kubectl apply -f backend-service.yml
```

---

# STEP 30 — CREATE REACT FRONTEND

```bash
npx create-react-app frontend
```

```bash
cd frontend
```

---

# STEP 31 — UPDATE APP.JS

Replace App.js with:

```javascript
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [users, setUsers] = useState([]);

  useEffect(() => {

    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));

  }, []);

  return (
    <div className="container">
      <h1>Paytm Wallet Dashboard</h1>

      {users.map(user => (
        <div className="card" key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <h3>₹ {user.wallet_balance}</h3>
        </div>
      ))}
    </div>
  );
}

export default App;
```

---

# STEP 32 — UPDATE APP.CSS

```css
body {
  margin: 0;
  font-family: Arial;
  background: #0f172a;
  color: white;
}

.container {
  padding: 30px;
}

.card {
  background: #1e293b;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
}
```

---

# STEP 33 — CREATE FRONTEND DOCKERFILE

```bash
vi Dockerfile
```

```dockerfile
FROM node:18 as build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM nginx

COPY --from=build /app/build /usr/share/nginx/html
```

---

# STEP 34 — BUILD FRONTEND IMAGE

```bash
docker build -t paytm-frontend:v1 .
```

---

# STEP 35 — PUSH FRONTEND IMAGE

```bash
docker tag paytm-frontend:v1 yourdockerhub/paytm-frontend:v1
```

```bash
docker push yourdockerhub/paytm-frontend:v1
```

---

# STEP 36 — CREATE FRONTEND DEPLOYMENT

```bash
vi frontend-deployment.yml
```

```yaml
apiVersion: apps/v1
kind: Deployment

metadata:
  name: frontend
  namespace: production

spec:
  replicas: 2

  selector:
    matchLabels:
      app: frontend

  template:
    metadata:
      labels:
        app: frontend

    spec:
      containers:
      - name: frontend

        image: yourdockerhub/paytm-frontend:v1

        ports:
        - containerPort: 80
```

Apply:

```bash
kubectl apply -f frontend-deployment.yml
```

---

# STEP 37 — CREATE FRONTEND SERVICE

```bash
vi frontend-service.yml
```

```yaml
apiVersion: v1
kind: Service

metadata:
  name: frontend-service
  namespace: production

spec:
  selector:
    app: frontend

  ports:
  - port: 80
    targetPort: 80
```

Apply:

```bash
kubectl apply -f frontend-service.yml
```

---

# STEP 38 — INSTALL NGINX INGRESS CONTROLLER

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
```

Verify:

```bash
kubectl get pods -n ingress-nginx
```

---

# STEP 39 — CREATE INGRESS

```bash
vi ingress.yml
```

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress

metadata:
  name: paytm-ingress
  namespace: production

spec:
  ingressClassName: nginx

  rules:
  - http:
      paths:

      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80

      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 80
```

Apply:

```bash
kubectl apply -f ingress.yml
```

---

# STEP 40 — GET LOAD BALANCER URL

```bash
kubectl get svc -n ingress-nginx
```

Copy EXTERNAL-IP.

Open in browser.

---

# STEP 41 — VERIFY APPLICATION

Check:

* Frontend loads
* API works
* MySQL connection works
* User data displays

---

# STEP 42 — CHECK ALL RESOURCES

```bash
kubectl get pods -n production
```

```bash
kubectl get svc -n production
```

```bash
kubectl get ingress -n production
```

```bash
kubectl get pvc -n production
```

```bash
kubectl get statefulset -n production
```

---

# IMPORTANT REAL TIME COMMANDS

## View Logs

```bash
kubectl logs podname -n production
```

## Describe Pod

```bash
kubectl describe pod podname -n production
```

## Restart Deployment

```bash
kubectl rollout restart deployment frontend -n production
```

## Scale Deployment

```bash
kubectl scale deployment frontend --replicas=4 -n production
```

## Delete Pod

```bash
kubectl delete pod podname -n production
```

---

# WHAT HAPPENS IF MYSQL POD DELETES?

If MySQL pod deletes:

```bash
kubectl delete pod mysql-0 -n production
```

Kubernetes StatefulSet automatically recreates:

* Same pod name
* Same storage
* Same data
* Same PVC

Data will not be lost.

---

# HOW INGRESS WORKS

```text
Browser
   ↓
AWS Load Balancer
   ↓
NGINX Ingress
   ↓
Frontend Service
   ↓
React Frontend Pod
   ↓
Backend Service
   ↓
NodeJS Backend Pod
   ↓
MySQL StatefulSet
   ↓
Persistent Volume
   ↓
AWS EBS Volume
```

---

# FUTURE IMPROVEMENTS

This project can be upgraded with:

* HTTPS SSL
* Route53 Domain
* Jenkins CI/CD
* GitHub Actions
* Helm Charts
* Monitoring using Prometheus
* Grafana Dashboard
* HPA Autoscaling
* Redis Cache
* Payment Gateway Integration
* Real Paytm APIs
* JWT Authentication

---

# TROUBLESHOOTING SECTION

## Pod CrashLoopBackOff

Check logs:

```bash
kubectl logs podname -n production
```

---

## ImagePullBackOff

Check:

* DockerHub image exists
* Image name correct
* DockerHub login done

---

## Database Connection Failed

Check:

```bash
kubectl get configmap -n production
```

```bash
kubectl get secret -n production
```

---

## Ingress Not Working

Check:

```bash
kubectl get svc -n ingress-nginx
```

---

# FINAL RESULT

At the end of project:

You will have:

* Real Kubernetes Cluster on AWS
* Real ReactJS Frontend
* Real NodeJS Backend
* Real MySQL StatefulSet
* Persistent Storage
* Ingress Routing
* Load Balancer
* Dockerized Application
* Full Stack Kubernetes Deployment

---

# PROJECT COMPLETION SUMMARY

This is a complete Production Style Kubernetes Full Stack Project.

Using this project you learn:

* AWS EC2
* KOPS Cluster Setup
* Kubernetes Architecture
* Namespace
* ConfigMap
* Secret
* Deployment
* Service
* StatefulSet
* Persistent Volume
* Ingress Controller
* Docker
* ReactJS
* NodeJS
* MySQL
* AWS Load Balancer
* Real Time Troubleshooting

---

# END OF DOCUMENT
