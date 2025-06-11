# Promptly

Promptly is a full-stack application designed to streamline development workflows. It features a React + TypeScript + Vite frontend and a NestJS backend, all containerized with Docker for easy setup and deployment.

## Features

### Frontend

- Built with React, TypeScript, and Vite.
- Implements React Router for navigation.
- Organized with alias paths for cleaner imports.
- Includes ESLint for code quality and Prettier for consistent formatting.

### Backend

- Built with NestJS, a progressive Node.js framework.
- Modular architecture for scalability.
- Includes unit and end-to-end testing with Jest and Supertest.

### Docker

- Dockerized services for both frontend and backend.
- Uses `docker-compose` for multi-container orchestration.

---

## Project Structure

```
.
├── backend/       # NestJS backend
│   ├── src/       # Source code
│   ├── test/      # Unit and e2e tests
│   ├── Dockerfile # Backend Docker configuration
│   └── ...
├── frontend/      # React + Vite frontend
│   ├── src/       # Source code
│   ├── public/    # Static assets
│   ├── Dockerfile # Frontend Docker configuration
│   └── ...
├── docker-compose.yml # Docker Compose configuration
└── README.md      # Project documentation
```

---

## Prerequisites

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (optional for local development)

---

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd promptly
   ```

2. Build and start the application using Docker Compose:

   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:8000](http://localhost:8000)

---

## Development

### Frontend

To run the frontend locally:

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend

To run the backend locally:

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run start:dev
   ```

---

## Testing

### Frontend

Run ESLint to check for linting issues:

```bash
npm run lint
```

### Backend

Run unit tests:

```bash
npm run test
```

Run end-to-end tests:

```bash
npm run test:e2e
```

---

## Deployment

For production deployment, ensure the Docker images are built and pushed to a container registry. Update the `docker-compose.yml` file as needed for production configurations.

---
