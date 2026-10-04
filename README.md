# 🐳 Dockerized Full Stack Application

> A production-grade, multi-tier web application packaged so that local development mirrors production as closely as possible.

![Architecture Flow](https://img.shields.io/badge/Architecture-React%20%E2%86%92%20Express%20%E2%86%92%20PostgreSQL-blue?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Compose%20v2-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-20%20Alpine-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%20Alpine-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

---

## 📌 Project Overview

This repository demonstrates how to architect, containerize, and orchestrate a full-stack application using **Docker**, **Docker Compose**, **React**, **Express**, and **PostgreSQL**. The primary architectural objective is **strict environment parity**—ensuring that every developer's local environment mirrors staging and production environments bit-for-bit.

```
┌──────────────────────────────────────────────┐
│           React Frontend Container           │
│   (Vite + TypeScript · Alpine Nginx Proxy)    │
│                 Port: 3000                   │
└──────────────────────┬───────────────────────┘
                       │ HTTP /api Reverse Proxy
                       ▼
┌──────────────────────────────────────────────┐
│            Express API Container             │
│   (Node 20 Alpine · TypeScript · Non-root)   │
│                 Port: 5000                   │
└──────────────────────┬───────────────────────┘
                       │ TCP Connection Pool (5432)
                       ▼
┌──────────────────────────────────────────────┐
│             PostgreSQL Container             │
│    (PostgreSQL 16 Alpine · Named Volume)     │
│                 Port: 5432                   │
└──────────────────────────────────────────────┘
```

---

## 🎯 Problem

In modern software teams, **"Works on my machine"** discrepancies cause critical friction:
- Developers run varying minor versions of Node or PostgreSQL on macOS, Linux, and Windows.
- Missing native OS packages or differences in connection strings break initial setups.
- Onboarding new engineers frequently took days of manual configuration and dependency troubleshooting.
- Bugs discovered in production could not be reliably reproduced in local environments.

---

## 💡 Solution

We eliminated local drift by declaring the entire runtime topology as code in **Docker Compose**:
1. **Identical Base OS**: All services run on lightweight, standardized Alpine Linux images.
2. **Deterministic Networking**: Internal DNS service discovery (`http://api:5000`, `postgres:5432`) across an isolated bridge network (`app-network`).
3. **Sequential Dependency Orchestration**: Service startup is governed by live **healthchecks** rather than arbitrary delay sleeps (`condition: service_healthy`).
4. **Persistent State Management**: Dedicated Docker volumes ensure database state persists across container rebuilds.

---

## 🏗️ Architecture & Component Details

### 1. React Frontend Container (`client/`)
- **Technology**: React 18, TypeScript, Vite.
- **Production Stage**: Multi-stage Docker build producing optimized static bundles served through **Nginx Alpine**.
- **Reverse Proxy**: Nginx proxies all `/api/*` traffic directly to the internal `api:5000` service, eliminating CORS issues in production.
- **Development Profile**: Includes polling-based Hot Module Replacement (HMR) for instant code updates.

### 2. Express API Container (`server/`)
- **Technology**: Express, TypeScript, Node.js 20.
- **Connection Pooling**: `pg` client pool with configurable timeouts and automatic query execution metrics.
- **Security & Hardening**:
  - `helmet` security headers.
  - Granular CORS policies.
  - Container executes under non-privileged user `node` instead of root.
  - Graceful shutdown handles `SIGTERM`/`SIGINT` by finishing active queries and releasing database connections.
- **Diagnostic & Health Endpoints**:
  - `GET /api/health`: Validates PostgreSQL live query latency (`SELECT 1`), process memory, and host telemetry.
  - `GET /api/system-info`: Inspects container CPU architecture, memory utilization, and pool stats.
  - `GET /api/items`, `POST /api/items`, `PATCH /api/items/:id`, `DELETE /api/items/:id`: Interactive CRUD endpoints.

### 3. PostgreSQL Database Container (`db/`)
- **Technology**: PostgreSQL 16 Alpine.
- **Automatic Initialization**: Mounts `db/init.sql` into `/docker-entrypoint-initdb.d/init.sql` to generate tables, indices, and seed data automatically on first boot.
- **Health Probe**: Uses native `pg_isready -U postgres -d fullstack_db`.

---

## ⚡ Fast Build Times & Layer Caching Strategy

As containerized applications scale, slow build times degrade developer velocity. This project employs key optimizations:
1. **Multi-Stage Builds**: Strips compiler toolchains (`tsc`, `devDependencies`) from production runner images, reducing image sizes by over 70%.
2. **Order of Invalidation**: `package*.json` is copied and cached before application source code. Code changes do **not** trigger re-installation of npm dependencies.
3. **Dedicated `.dockerignore`**: Excludes `node_modules`, build artifacts, and local secrets from Docker build contexts.

---

## 🔒 Security Best Practices

- **Zero-Secret Repository**: Real credentials are kept out of Git. Only `.env.example` is committed.
- **Principle of Least Privilege**: API process runs as the unprivileged `node` user.
- **Network Isolation**: Only port `3000` (Frontend) and `5000` (API) are exposed to the host machine. PostgreSQL port exposure can be restricted to internal container networks in production.

---

## 🚀 Quickstart: Single-Command Local Run

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 1. Launch the Stack
Run the full production-parity stack with a single command:

```bash
docker compose up --build
```

Or run in detached mode using Make:
```bash
make up
```

### 2. Access the Applications
| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend UI** | [http://localhost:3000](http://localhost:3000) | Interactive Container Telemetry & Task Manager |
| **API Healthcheck** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | Container & Database Probe status |
| **System Diagnostics** | [http://localhost:5000/api/system-info](http://localhost:5000/api/system-info) | Container memory, OS architecture & pool metrics |
| **Database** | `localhost:5432` | PostgreSQL (User: `postgres`, DB: `fullstack_db`) |

---

## 💻 Development Workflow with Live Hot-Reload

For active coding where edits on the host should immediately trigger live updates without container rebuilds:

```bash
# Launch development stack
docker compose -f docker-compose.dev.yml up --build

# Or with Makefile
make dev
```
- Edits in `client/src/` instantly trigger Vite HMR in the browser.
- Edits in `server/src/` instantly reload the API via `tsx watch`.

---

## 🛠️ Handy Makefile Commands

| Command | Action |
| :--- | :--- |
| `make up` | Start production stack in background (`docker compose up --build -d`) |
| `make dev` | Start development stack with live file watchers |
| `make down` | Stop and teardown containers and network |
| `make logs` | Stream logs across all containers |
| `make ps` | Inspect running containers and health states |
| `make health` | Query API and PostgreSQL health status via curl |
| `make seed` | Re-seed the database with demo records |
| `make clean` | Remove all containers and wipe persistent volumes |

---

## 📊 Results & Impact

- **Zero Onboarding Delay**: Developers can clone the repository and run `docker compose up --build` to have a full, working application running locally in under 2 minutes.
- **Zero Environment Drift**: Complete alignment between developer machines and containerized cloud deployment environments.
- **Robust Failure Recovery**: Container healthchecks prevent cascading startup crashes.
