# Tiny Webshop

A full-stack e-commerce web application built with **React (frontend)** and **Node.js/TypeScript (backend)** with a **PostgreSQL database**.  
Now fully containerized with Docker and deployed to AWS with a production-ready cloud architecture.

To access the website: https://d1plvygs2hy3tb.cloudfront.net/
The containers in the backend are not active to save costs, if you want to explore the website, contanct me on LinkedIn to activate it.

<img width="15320" height="13410" alt="Ecommerce AWS diagram" src="https://github.com/user-attachments/assets/7894c6f8-e26f-4d0e-8099-3f143a046f2e" />



---

## 🚀 Features

- User registration and login with JWT authentication  
- Browse products and view details  
- Add products to cart with stock validation  
- Create, update, delete products (admin functionality via Postman)  

---

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, React Router  
- **Backend:** Node.js, TypeScript, Express  
- **Database:** PostgreSQL  
- **Testing:** Postman, Newman  
- **Containerization:** Docker, Docker Compose  
- **Cloud Deployment:** AWS ECS Fargate, RDS, ALB, CloudFront, ECR, S3  

---

## 🐳 Local Development

### Backend (Docker)

Run `cd backend` to navigate to the backend directory.

Run `docker compose up --build`

This will:

- Start a PostgreSQL container
- Start a backend server container
- Seed the database with products
- Automatically connect backend to the database via Docker networking

### Frontend (Without Docker)
Navigate to frontend folder:

- Run `cd frontend` to navigate to the frontend directory:

Install dependencies:

- Run `npm install`

Start frontend:

- Run `npm start`

### Frontend (Docker)
Navigate to frontend folder:

- Run `cd frontend` to navigate to the frontend directory:

- Run `docker compose up --build`

- Open a tab in your prowser and paste `http://localhost:3001/`

### Postman API Tests

Install Newman globally (if not already installed):

- `npm install -g newman`

- Run Postman collection in the backend directory:

  `npm run test:postman`

Ensure backend is running (via Docker) before running tests.

---
## ☁️ AWS Deployment
This project is deployed to AWS using best practices for scalability, security, and high availability.

Architecture Highlights:

- ECS Fargate for containerized backend tasks in private subnets

- Application Load Balancer (ALB) in public subnets for secure, scalable routing

- Amazon RDS (PostgreSQL) Multi-AZ for fault-tolerant relational database backend

- Amazon ECR for container image hosting

- Amazon S3 + CloudFront for static frontend hosting and CDN caching

- VPC Endpoints (PrivateLink) for ECS ↔ ECR/S3 access without NAT Gateway

- CI/CD Pipeline integrated with GitHub → automated Postman tests → build & push Docker images to ECR → ECS service deployment




