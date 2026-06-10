# GSMAXALL AI Operating System - Production Deployment Guide

This guide details the step-by-step instructions to configure, run, and scale the **GSMAXALL AI Operating System** in production environments.

---

## 1. System Requirements & Architecture

The application is structured into two main tiers:
1. **Next.js Frontend & Core REST API**: Deployed on **Vercel** or standard Node.js server.
2. **Standalone Runner WebSocket Server**: Spawns terminal sessions and runs agents. Deployed on virtual machine servers (**AWS EC2**, **GCP Compute Engine**, or **DigitalOcean Droplet**) behind secure WebSockets.

### Required Databases & Caching
- **PostgreSQL**: Stores persistent user information, chat histories, workflows, and notes.
- **Redis Cache**: Queue processor for agent execution logs and pub/sub socket events.
- **Qdrant**: High-dimensional vector database for semantic Knowledge Hub indexing.

---

## 2. Docker Compose Production Run

To spin up all services on a single production server (e.g. AWS EC2 instance), use the bundled `docker-compose.yml` file:

### Step 1: Clone the codebase and navigate to workspace
```bash
git clone https://github.com/your-org/gsmaxall-system.git
cd gsmaxall-system
```

### Step 2: Configure production environment variables
Create and modify the `.env` configuration file:
```bash
cp .env.example .env
```

Ensure you customize:
- `DATABASE_URL` (Point to your production managed PostgreSQL instance or let Docker host it)
- `REDIS_URL` (For task caching and queueing)
- `QDRANT_URL` (Endpoint to your Qdrant cluster)
- `NEXTAUTH_SECRET` (Run `openssl rand -base64 32` to generate a secure key)
- `RUNNER_ALLOW_REAL_SHELL` (Set to `true` to allow terminal execution, otherwise sandbox demo is active)

### Step 3: Run services concurrently
```bash
docker-compose up --build -d
```

---

## 3. Sandboxing Terminal Executions in Production

> [!CAUTION]
> If you configure `RUNNER_ALLOW_REAL_SHELL=true` in cloud production environments, you must sandbox the container executions using micro-VM runtimes like **gVisor (runsc)** or **Firecracker** to prevent host system takeover by AI agents or malicious users.

To enable **gVisor** sandboxing in Docker:
1. Install `runsc` on your Linux host machine.
2. Configure Docker daemon (`/etc/docker/daemon.json`):
   ```json
   {
     "runtimes": {
       "runsc": {
         "path": "/usr/bin/runsc"
       }
     }
   }
   ```
3. Update the runner service inside `docker-compose.yml` to use the runtime:
   ```yaml
   runner:
     runtime: runsc
     build:
       context: .
       dockerfile: Dockerfile.runner
     ...
   ```

---

## 4. Vercel Hosting for Next.js App

To host the user interface on **Vercel** while keeping database and runner processes on VM nodes:
1. Push the Next.js code folder to GitHub.
2. Connect your repository to Vercel and import the project.
3. Add the following **Environment Variables** in Vercel Dashboard:
   - `DATABASE_URL`
   - `REDIS_URL`
   - `QDRANT_URL`
   - `NEXT_PUBLIC_RUNNER_WS_URL` (Point this to your VM domain: e.g. `wss://runner.gsmaxall.ai`)
   - `NEXTAUTH_SECRET`
4. Set the Build Command as: `npx prisma generate && next build`
5. Press Deploy!
