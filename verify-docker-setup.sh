#!/bin/bash
# Docker Setup Verification Script

set -e

echo "🐳 Blogify Docker Setup Verification"
echo "====================================="
echo ""

# Check Docker installation
echo "✓ Checking Docker installation..."
docker --version
docker compose version
echo ""

# Check for required files
echo "✓ Checking required files..."
files=(
    "docker-compose.yml"
    ".env.example"
    "blog-application/Dockerfile"
    "blog-application/.dockerignore"
    "blog-application/src/main/resources/application-docker.properties"
    "blog-frontend/Dockerfile"
    "blog-frontend/.dockerignore"
    "blog-frontend/nginx.conf"
    "DOCKER_GUIDE.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file (MISSING)"
        exit 1
    fi
done
echo ""

# Validate docker-compose.yml
echo "✓ Validating docker-compose.yml..."
docker compose config --quiet
echo "  ✓ Docker Compose configuration is valid"
echo ""

# Check .env file
echo "✓ Checking environment configuration..."
if [ ! -f ".env" ]; then
    echo "  ⚠ .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "  ✓ Created .env file"
    echo "  ⚠ Please update .env with your actual credentials before running"
else
    echo "  ✓ .env file exists"
fi
echo ""

# Verify .gitignore
echo "✓ Checking .gitignore..."
if grep -q "^\.env$" .gitignore; then
    echo "  ✓ .env is ignored in git"
else
    echo "  ✗ .env is NOT ignored in git (security risk!)"
    exit 1
fi
echo ""

echo "====================================="
echo "✅ All checks passed!"
echo ""
echo "Next steps:"
echo "  1. Review and update .env file with secure values"
echo "  2. Run: docker compose up --build"
echo "  3. Access frontend at http://localhost:3000"
echo "  4. Read DOCKER_GUIDE.md for detailed instructions"
echo ""

exit 0
