# Blogify

A modern full-stack blogging application built with Spring Boot and React.

## 🚀 Quick Start with Docker (Recommended)

The easiest way to run Blogify is with Docker:

```bash
# Clone the repository
git clone https://github.com/Sahilarora2165/Blogify.git
cd Blogify

# Copy environment template
cp .env.example .env

# Start all services with Docker Compose
docker compose up --build
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api

📖 For detailed instructions, troubleshooting, and production deployment, see [DOCKER_GUIDE.md](DOCKER_GUIDE.md)

## 🛠️ Tech Stack

**Backend (blog-application/)**
- Java 17
- Spring Boot 3.4.2
- Spring Security with JWT authentication
- MySQL database
- Maven

**Frontend (blog-frontend/)**
- React 19
- Vite 6
- Tailwind CSS
- React Router
- Axios

## 📦 Project Structure

```
Blogify/
├── blog-application/          # Spring Boot backend
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── blog-frontend/             # React frontend
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml         # Docker orchestration
├── .env.example              # Environment template
└── DOCKER_GUIDE.md           # Comprehensive Docker guide
```

## 🐳 Docker Setup

This project includes a complete Docker setup with:
- ✅ Multi-stage builds for optimized images
- ✅ MySQL 8.0 with health checks
- ✅ Nginx reverse proxy for frontend
- ✅ Volume persistence for data and uploads
- ✅ Environment-based configuration
- ✅ Production-ready setup

## 📚 Documentation

- [Docker Setup Guide](DOCKER_GUIDE.md) - Complete guide for running with Docker
- [Performance Optimizations](PERFORMANCE_OPTIMIZATIONS.md) - Backend optimizations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.
