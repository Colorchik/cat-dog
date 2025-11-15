#!/bin/bash

# Server setup script for VPS
# Run this script on a fresh Ubuntu/Debian server

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root (use sudo)"
    exit 1
fi

print_info "Starting server setup..."

# Update system
print_info "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install required packages
print_info "Installing required packages..."
apt-get install -y \
    curl \
    wget \
    git \
    ufw \
    fail2ban \
    unattended-upgrades

# Install Docker
print_info "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    print_success "Docker installed"
else
    print_info "Docker already installed"
fi

# Install Docker Compose
print_info "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
    curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed"
else
    print_info "Docker Compose already installed"
fi

# Configure firewall
print_info "Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
print_success "Firewall configured"

# Configure fail2ban
print_info "Configuring fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban
print_success "Fail2ban configured"

# Configure automatic security updates
print_info "Configuring automatic security updates..."
echo 'Unattended-Upgrade::Automatic-Reboot "false";' >> /etc/apt/apt.conf.d/50unattended-upgrades
systemctl enable unattended-upgrades
print_success "Automatic updates configured"

# Create application directory
APP_DIR="/opt/cat-dog"
print_info "Creating application directory at $APP_DIR..."
mkdir -p $APP_DIR
print_success "Application directory created"

# Create non-root user for deployment (optional)
print_info "Setup completed!"
print_info ""
print_info "Next steps:"
print_info "1. Clone your repository to $APP_DIR"
print_info "2. Copy .env.example to .env and configure it"
print_info "3. Run ./deploy.sh to deploy the application"
print_info ""
print_info "Or run manually:"
print_info "  cd $APP_DIR"
print_info "  docker compose up -d"

