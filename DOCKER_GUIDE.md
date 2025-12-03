# 🐳 Docker Guide for Blogify

A comprehensive guide to running the Blogify application using Docker.

## 📖 Table of Contents
- [What is Docker?](#what-is-docker)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Step-by-Step Explanation](#step-by-step-explanation)
- [Common Commands](#common-commands)
- [Troubleshooting](#troubleshooting)
- [Development vs Production](#development-vs-production)

---

## 🤔 What is Docker?

### Simple Explanation

**Docker** is a platform that packages your application and all its dependencies into a standardized unit called a **container**. Think of it like a shipping container for software - it includes everything your application needs to run: code, runtime, system tools, and libraries.

### Key Concepts

- **Container**: A lightweight, standalone package that contains everything needed to run your application
- **Image**: A template used to create containers (like a blueprint)
- **Docker Compose**: A tool for defining and running multi-container Docker applications

### Why Use Docker for Blogify?

1. **Consistency**: Works the same on any machine (Windows, Mac, Linux)
2. **Easy Setup**: No need to manually install MySQL, Java, Node.js
3. **Isolation**: Each service runs in its own container
4. **Production-Ready**: Same setup for development and production
5. **One-Command Start**: Start the entire application with a single command

---

## 📋 Prerequisites

### 1. Install Docker Desktop

Choose your operating system:

#### Windows
- Download from: [Docker Desktop for Windows](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe)
- Requirements: Windows 10 64-bit or Windows 11
- Enable WSL 2 during installation

#### macOS
- Download from: [Docker Desktop for Mac](https://desktop.docker.com/mac/main/amd64/Docker.dmg)
- Requirements: macOS 10.15 or newer
- Choose Intel or Apple Silicon version

#### Linux
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Fedora/RHEL
sudo dnf install docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo systemctl enable docker
```

### 2. Verify Installation

After installation, open a terminal and run:

```bash
# Check Docker version
docker --version
# Expected output: Docker version 24.x.x, build xxxxx

# Check Docker Compose version
docker compose version
# Expected output: Docker Compose version v2.x.x

# Test Docker installation
docker run hello-world
# Should download and run a test container
```

---

## 🚀 Quick Start (5 Minutes)

Follow these steps to get Blogify running:

### Step 1: Clone the Repository

```bash
git clone https://github.com/Sahilarora2165/Blogify.git
cd Blogify
```

### Step 2: Create Environment File

```bash
# Copy the example environment file
cp .env.example .env

# (Optional) Edit .env with your preferred values
# On Windows: notepad .env
# On Mac/Linux: nano .env
```

### Step 3: Start the Application

```bash
# Build and start all services
docker compose up --build
```

This command will:
1. ✅ Build the backend Docker image (~3-5 minutes)
2. ✅ Build the frontend Docker image (~2-3 minutes)
3. ✅ Download MySQL 8.0 image (if not cached)
4. ✅ Start all three services

### Step 4: Access the Application

Wait for the containers to start (watch the logs), then open your browser:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **MySQL Database**: localhost:3306 (for database clients)

### Step 5: Stop the Application

Press `Ctrl+C` in the terminal, or run:

```bash
docker compose down
```

🎉 **Congratulations!** You're now running Blogify with Docker!

---

## 🔍 Step-by-Step Explanation

### Architecture Overview

```
┌─────────────┐
│   Frontend  │ (React + Vite + Nginx)
│  Port 3000  │
└──────┬──────┘
       │ /api requests
       ▼
┌─────────────┐
│   Backend   │ (Spring Boot + Java 17)
│  Port 8080  │
└──────┬──────┘
       │ JDBC
       ▼
┌─────────────┐
│    MySQL    │ (Database)
│  Port 3306  │
└─────────────┘
```

### Understanding Each Docker File

#### 1. `blog-application/Dockerfile` (Backend)

```dockerfile
# Build stage - compiles Java code
FROM maven:3.8.3-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B  # Download dependencies (cached)
COPY src ./src
RUN mvn clean package -DskipTests  # Build JAR file

# Production stage - runs the application
FROM openjdk:17.0.1-jdk-slim
WORKDIR /app
RUN mkdir -p /app/uploads  # Directory for file uploads
COPY --from=build /app/target/blog-application-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

**Key Features**:
- Multi-stage build reduces final image size (~200MB instead of ~700MB)
- Caches Maven dependencies for faster rebuilds
- Uses environment variables for configuration

#### 2. `blog-frontend/Dockerfile` (Frontend)

```dockerfile
# Build stage - builds React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # Creates optimized production build

# Production stage - serves with Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Key Features**:
- Multi-stage build: Node.js for building, Nginx for serving
- Final image is only ~40MB (Alpine Linux)
- Nginx serves static files efficiently

#### 3. `blog-frontend/nginx.conf` (Nginx Configuration)

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    
    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://backend:8080/api/;
        # ... proxy headers ...
    }
    
    # Serve React app
    location / {
        try_files $uri $uri/ /index.html;  # SPA routing
    }
}
```

**Key Features**:
- Proxies `/api` requests to backend service
- Handles React Router (SPA routing) with `try_files`
- Adds security headers and gzip compression

#### 4. `docker-compose.yml` (Orchestration)

This file defines three services that work together:

##### MySQL Service

```yaml
mysql:
  image: mysql:8.0
  environment:
    MYSQL_DATABASE: blog_db
    MYSQL_ROOT_PASSWORD: password
  volumes:
    - mysql_data:/var/lib/mysql  # Persists database data
  healthcheck:  # Ensures MySQL is ready before backend starts
    test: ["CMD", "mysqladmin", "ping"]
    interval: 10s
```

##### Backend Service

```yaml
backend:
  build: ./blog-application
  depends_on:
    mysql:
      condition: service_healthy  # Waits for MySQL
  environment:
    SPRING_PROFILES_ACTIVE: docker  # Uses application-docker.properties
    MYSQL_HOST: mysql  # Docker DNS resolves to mysql container
  volumes:
    - uploads_data:/app/uploads  # Persists file uploads
```

##### Frontend Service

```yaml
frontend:
  build: ./blog-frontend
  depends_on:
    - backend  # Waits for backend
  ports:
    - "3000:80"  # Maps host:container ports
```

### Environment Variables (`.env` file)

The `.env` file contains configuration:

```env
# Database credentials
MYSQL_DATABASE=blog_db
MYSQL_ROOT_PASSWORD=your-password
MYSQL_USER=bloguser
MYSQL_PASSWORD=your-password

# Security
JWT_SECRET=your-secret-key-change-in-production

# Frontend API URL
VITE_API_URL=/api
```

**Important**: Never commit `.env` to Git! Use `.env.example` as a template.

---

## 🛠️ Common Commands

### Starting Services

```bash
# Start all services (attached mode - see logs)
docker compose up

# Start all services in background (detached mode)
docker compose up -d

# Build images and start (after code changes)
docker compose up --build

# Start specific service only
docker compose up frontend
```

### Stopping Services

```bash
# Stop all services (keeps data)
docker compose down

# Stop and remove volumes (deletes database data)
docker compose down -v

# Stop specific service
docker compose stop backend
```

### Viewing Logs

```bash
# View logs from all services
docker compose logs

# Follow logs (like tail -f)
docker compose logs -f

# View logs from specific service
docker compose logs backend

# View last 100 lines
docker compose logs --tail=100 frontend
```

### Managing Containers

```bash
# List running containers
docker compose ps

# Execute command in container
docker compose exec backend bash

# View resource usage
docker stats

# Restart specific service
docker compose restart backend
```

### Database Operations

```bash
# Connect to MySQL
docker compose exec mysql mysql -u root -p blog_db

# Backup database
docker compose exec mysql mysqldump -u root -p blog_db > backup.sql

# Restore database
docker compose exec -T mysql mysql -u root -p blog_db < backup.sql

# View database logs
docker compose logs mysql
```

### Cleaning Up

```bash
# Remove stopped containers
docker compose rm

# Remove all unused images
docker image prune -a

# Remove all unused volumes
docker volume prune

# Complete cleanup (nuclear option)
docker system prune -a --volumes
```

### Rebuilding After Changes

```bash
# Backend code changes
docker compose up --build backend

# Frontend code changes
docker compose up --build frontend

# Dependency changes (pom.xml or package.json)
docker compose build --no-cache backend
docker compose build --no-cache frontend
```

---

## 🔧 Troubleshooting

### Problem: Port Already in Use

**Error**: `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solutions**:

```bash
# Check what's using the port
# On Windows
netstat -ano | findstr :3000

# On Mac/Linux
lsof -i :3000

# Option 1: Stop the conflicting process
# On Windows: taskkill /PID <PID> /F
# On Mac/Linux: kill -9 <PID>

# Option 2: Change port in docker-compose.yml
# Change "3000:80" to "3001:80"
```

### Problem: Database Connection Failed

**Error**: `Connection refused` or `Unknown database 'blog_db'`

**Solutions**:

```bash
# Check if MySQL is healthy
docker compose ps

# View MySQL logs
docker compose logs mysql

# Restart MySQL
docker compose restart mysql

# Wait longer for MySQL to start
# Increase healthcheck start_period in docker-compose.yml

# Verify database was created
docker compose exec mysql mysql -u root -p -e "SHOW DATABASES;"
```

### Problem: Backend Not Starting

**Error**: Container exits immediately or logs show errors

**Solutions**:

```bash
# View backend logs
docker compose logs backend

# Check if MySQL is ready
docker compose ps mysql

# Verify environment variables
docker compose config

# Rebuild with no cache
docker compose build --no-cache backend
docker compose up backend
```

### Problem: Frontend Shows 404 for API Calls

**Error**: API requests fail with 404 or CORS errors

**Solutions**:

```bash
# Check if backend is running
docker compose ps backend

# Test backend directly
curl http://localhost:8080/api/health

# Check Nginx logs
docker compose logs frontend

# Verify nginx.conf is correct
docker compose exec frontend cat /etc/nginx/conf.d/default.conf
```

### Problem: Cannot Access Application

**Solutions**:

```bash
# Check all services are running
docker compose ps

# Verify ports are mapped correctly
docker compose port frontend 80

# Check firewall settings
# Windows: Windows Defender Firewall
# Mac: System Preferences > Security & Privacy > Firewall
# Linux: sudo ufw status

# Try accessing from container directly
docker compose exec frontend curl localhost:80
```

### Problem: Slow Build Times

**Solutions**:

```bash
# Use Docker BuildKit for faster builds
export DOCKER_BUILDKIT=1
docker compose build

# Clean up unused layers
docker builder prune

# Increase Docker Desktop resources
# Settings > Resources > Increase CPU/Memory
```

### Problem: Out of Disk Space

**Solutions**:

```bash
# Check disk usage
docker system df

# Remove unused data
docker system prune -a

# Remove specific volumes
docker volume ls
docker volume rm <volume_name>
```

### Getting Help

```bash
# View Docker Compose help
docker compose --help

# View service configuration
docker compose config

# Validate docker-compose.yml
docker compose config --quiet

# View Docker events
docker events
```

---

## 🏭 Development vs Production

### Development Setup (Current)

The current configuration is optimized for development:

```yaml
# docker-compose.yml (Development)
services:
  backend:
    build: ./blog-application
    ports:
      - "8080:8080"  # Exposed for direct access
    volumes:
      - uploads_data:/app/uploads  # Persists between restarts
```

**Characteristics**:
- ✅ Hot reload friendly (rebuild to see changes)
- ✅ All ports exposed for debugging
- ✅ Verbose logging enabled
- ✅ Development-friendly error messages

### Production Recommendations

For production deployment, consider these changes:

#### 1. Security Enhancements

```yaml
# docker-compose.prod.yml
services:
  backend:
    restart: always  # Always restart on failure
    environment:
      JAVA_OPTS: "-Xms512m -Xmx1024m"  # Increase memory
      SPRING_PROFILES_ACTIVE: prod
    # Don't expose ports directly - use reverse proxy
    expose:
      - "8080"
    
  mysql:
    # Use secrets for passwords
    secrets:
      - mysql_root_password
    # Don't expose MySQL port externally
    expose:
      - "3306"

secrets:
  mysql_root_password:
    file: ./secrets/mysql_root_password.txt
```

#### 2. Use Environment-Specific Files

```bash
# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up

# Staging
docker compose -f docker-compose.yml -f docker-compose.staging.yml up
```

#### 3. Reverse Proxy Setup

Add Nginx as a reverse proxy:

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/prod.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
```

#### 4. Health Checks and Monitoring

```yaml
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

#### 5. Production Checklist

Before deploying to production:

- [ ] Change all default passwords in `.env`
- [ ] Use strong JWT secret (64+ random characters)
- [ ] Enable HTTPS with SSL certificates
- [ ] Set up database backups
- [ ] Configure log rotation
- [ ] Set resource limits (CPU, memory)
- [ ] Use Docker secrets for sensitive data
- [ ] Implement monitoring (Prometheus, Grafana)
- [ ] Set up automated backups
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Use a reverse proxy (Nginx, Traefik)
- [ ] Set up CI/CD pipeline
- [ ] Test disaster recovery procedures

#### 6. Performance Optimizations

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
    
  mysql:
    command: --innodb-buffer-pool-size=1G --max-connections=200
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

#### 7. Scaling

```bash
# Scale backend instances
docker compose up --scale backend=3

# Use load balancer
docker compose -f docker-compose.yml -f docker-compose.lb.yml up
```

### Production Deployment Platforms

Consider these platforms for production:

1. **AWS ECS/Fargate**: Managed container service
2. **Google Cloud Run**: Serverless containers
3. **Azure Container Instances**: Simple container hosting
4. **DigitalOcean App Platform**: Easy container deployment
5. **Kubernetes**: For complex, large-scale deployments

---

## 📚 Additional Resources

### Docker Learning

- [Docker Official Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### Blogify Specific

- [Spring Boot Docker Guide](https://spring.io/guides/topicals/spring-boot-docker/)
- [Vite Docker Deployment](https://vitejs.dev/guide/static-deploy.html)
- [MySQL Docker Hub](https://hub.docker.com/_/mysql)

### Security

- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [OWASP Docker Security](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)

---

## 🆘 Need Help?

If you encounter issues not covered in this guide:

1. Check the logs: `docker compose logs -f`
2. Search GitHub Issues: [Blogify Issues](https://github.com/Sahilarora2165/Blogify/issues)
3. Create a new issue with:
   - Docker version: `docker --version`
   - Docker Compose version: `docker compose version`
   - Operating system
   - Full error message
   - Relevant logs

---

## 📝 Quick Reference Card

```bash
# 🚀 Start
docker compose up -d

# 📜 Logs
docker compose logs -f

# 🔄 Rebuild
docker compose up --build

# 🛑 Stop
docker compose down

# 🗑️ Clean
docker compose down -v

# 📊 Status
docker compose ps

# 🐚 Shell
docker compose exec backend bash

# 💾 Database
docker compose exec mysql mysql -u root -p blog_db
```

---

**Happy Dockerizing! 🐳🚀**
