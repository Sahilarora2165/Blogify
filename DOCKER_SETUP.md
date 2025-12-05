# Docker Setup for Blogify

This document explains how to run the Blogify application using Docker and Docker Compose.

## Prerequisites

- Docker installed (version 20.10 or later)
- Docker Compose installed (version 2.0 or later)

## Quick Start

1. **Clone the repository** (if not already done):
   ```bash
   git clone https://github.com/Sahilarora2165/Blogify.git
   cd Blogify
   ```

2. **Start all services**:
   ```bash
   docker-compose up --build
   ```

   This command will:
   - Build the backend Spring Boot application
   - Build the frontend React application
   - Start a MySQL database
   - Set up networking between all services
   - Mount a volume for persistent image uploads

3. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - MySQL: localhost:3307 (from host machine)

## Image Upload Configuration

The Docker setup ensures that uploaded images persist across container restarts:

- **Upload Directory**: Images are stored in `/app/uploads` inside the backend container
- **Volume Mount**: The `./uploads` directory on your host machine is mounted to `/app/uploads` in the container
- **Access Images**: Images are accessible via `http://localhost:8080/uploads/{filename}`

### How it Works

1. The `blog-application/Dockerfile` creates the `/app/uploads` directory inside the container
2. The `docker-compose.yml` mounts `./uploads:/app/uploads` to persist files on the host
3. The `application-docker.properties` sets `file.upload-dir=/app/uploads`
4. Spring Boot serves files from `/uploads/**` via the WebConfig configuration

## Services

### Backend (Spring Boot)
- **Port**: 8080
- **Container Name**: blogify-backend
- **Profile**: docker (uses `application-docker.properties`)
- **Database**: Connects to MySQL container at `mysql:3306`
- **Environment Variables** (optional, with defaults):
  - `DB_URL` (default: `jdbc:mysql://mysql:3306/blog_db`)
  - `DB_USERNAME` (default: `root`)
  - `DB_PASSWORD` (default: `rootpassword`)

### Frontend (React + Vite)
- **Port**: 5173 (mapped from container port 80)
- **Container Name**: blogify-frontend
- **Built with**: Nginx serving static files

### MySQL Database
- **Port**: 3307 (host) → 3306 (container)
- **Container Name**: blogify-mysql
- **Database**: blog_db (configurable via `MYSQL_DATABASE`)
- **Credentials**:
  - Username: root
  - Password: rootpassword (configurable via `MYSQL_ROOT_PASSWORD`)
- **Data Persistence**: Using Docker volume `mysql-data`

## Useful Commands

### Start services in detached mode
```bash
docker-compose up -d
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes (WARNING: deletes database data)
```bash
docker-compose down -v
```

### Rebuild specific service
```bash
docker-compose up --build backend
```

### Access backend container shell
```bash
docker exec -it blogify-backend sh
```

### Access MySQL database
```bash
docker exec -it blogify-mysql mysql -u root -prootpassword blog_db
```

## Directory Structure

```
Blogify/
├── blog-application/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── src/main/resources/
│       ├── application.properties (for local development)
│       └── application-docker.properties (for Docker)
├── blog-frontend/
│   ├── Dockerfile
│   └── .dockerignore
├── docker-compose.yml
├── uploads/ (created automatically, persists uploaded images)
└── DOCKER_SETUP.md (this file)
```

## Troubleshooting

### Images not displaying after upload

1. Check if uploads directory was created:
   ```bash
   ls -la uploads/
   ```

2. Verify volume mount:
   ```bash
   docker inspect blogify-backend | grep -A 10 Mounts
   ```

3. Check backend logs:
   ```bash
   docker-compose logs backend
   ```

### Cannot connect to database

1. Check if MySQL is healthy:
   ```bash
   docker-compose ps
   ```

2. Wait for MySQL to be ready (healthcheck configured with 10 retries)

3. Check MySQL logs:
   ```bash
   docker-compose logs mysql
   ```

### Port already in use

If you get "port already in use" errors, you can either:
- Stop the conflicting service on your host
- Edit `docker-compose.yml` to use different host ports

## Development vs Docker

- **Local Development**: Uses `application.properties` with `file.upload-dir=./uploads`
- **Docker Environment**: Uses `application-docker.properties` with `file.upload-dir=/app/uploads`

The Spring profile is automatically activated in Docker via the `SPRING_PROFILES_ACTIVE=docker` environment variable.

## Environment Variables

You can customize database credentials and other settings using environment variables. Create a `.env` file in the root directory:

```bash
# .env file (create this for custom configuration)
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_DATABASE=blog_db
DB_URL=jdbc:mysql://mysql:3306/blog_db
DB_USERNAME=root
DB_PASSWORD=your_secure_password
```

Docker Compose will automatically load these variables. If not provided, it will use the default values specified in the `docker-compose.yml`.

## Security Note

⚠️ **Important**: The database password in `docker-compose.yml` is for development only. For production:
- Use strong passwords
- Store sensitive values in environment variables or secrets management
- Never commit production credentials to version control
