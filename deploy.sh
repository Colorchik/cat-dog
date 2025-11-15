#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="cat-dog"
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    print_error ".env file not found!"
    print_info "Creating .env from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success ".env file created. Please edit it with your configuration."
        exit 1
    else
        print_error ".env.example not found!"
        exit 1
    fi
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Use docker compose (v2) if available, otherwise docker-compose (v1)
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

print_info "Starting deployment..."

# Stop existing containers
print_info "Stopping existing containers..."
$COMPOSE_CMD down

# Pull latest images (if using pre-built images)
# print_info "Pulling latest images..."
# $COMPOSE_CMD pull

# Build images
print_info "Building images..."
$COMPOSE_CMD build --no-cache

# Start services
print_info "Starting services..."
$COMPOSE_CMD up -d

# Wait for services to be healthy
print_info "Waiting for services to be ready..."
sleep 10

# Check service status
print_info "Checking service status..."
$COMPOSE_CMD ps

# Run database migrations (if not already run by entrypoint)
print_info "Checking database migrations..."
# Migrations are handled by docker-entrypoint.sh, but we can verify
sleep 5
$COMPOSE_CMD exec -T backend npx sequelize-cli db:migrate || print_info "Migrations may have already run"

# Show logs
print_info "Recent logs:"
$COMPOSE_CMD logs --tail=50

print_success "Deployment completed!"
print_info "Services are running. Check logs with: $COMPOSE_CMD logs -f"
print_info "Stop services with: $COMPOSE_CMD down"

