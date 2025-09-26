# Tiny Webshop

A full-stack e-commerce web application built with React (frontend) and Node.js/TypeScript (backend) with PostgreSQL database. Includes authentication, and API testing via Postman.

# Features

1- User registration and login with JWT authentication

2- Browse products and view details

3- Add products to cart with stock validation

4- create, update, delete products (admin functionality-through postman)

# Tech Stack

1- Frontend: React, TypeScript, React Router

2- Backend: Node.js, TypeScript, Express

3- Database: PostgreSQL

4- Testing: Postman, Newman

# Backend (Docker)

Run `cd backend` to navigate to the backend directory.

Run `docker compose up --build`

This will:

- Start a PostgreSQL container
- Start a backend server container
- Seed the database with products
- Automatically connect backend to the database via Docker networking

# Frontend (Without Docker)
Navigate to frontend folder:

- Run `cd frontend` to navigate to the frontend directory:

Install dependencies:

- Run `npm install`

Start frontend:

- Run `npm start`

# Frontend (Docker)
Navigate to frontend folder:

- Run `cd frontend` to navigate to the frontend directory:

- Run `docker compose up --build`

- Open a tab in your prowser and paste `http://localhost:3001/`

# Postman API Tests

Install Newman globally (if not already installed):

- `npm install -g newman`

- Run Postman collection in the backend directory:

  `npm run test:postman`

Ensure backend is running (via Docker) before running tests.





