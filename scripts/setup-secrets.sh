#!/bin/bash

# Setup script for GitHub Secrets and local environment
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔐 Setting up secrets for Tiny Webshop${NC}"

# Check if .gitignore exists and add .env if not present
if [ -f .gitignore ]; then
    if ! grep -q "^\.env$" .gitignore; then
        echo -e "${YELLOW}📝 Adding .env to .gitignore${NC}"
        echo ".env" >> .gitignore
    else
        echo -e "${GREEN}✅ .env already in .gitignore${NC}"
    fi
else
    echo -e "${YELLOW}📝 Creating .gitignore with .env${NC}"
    echo ".env" >> .gitignore
fi

# Create local .env file
echo -e "${YELLOW}📝 Creating local .env file${NC}"
cat > .env << EOF
# Local development environment variables
# DO NOT COMMIT THIS FILE TO GIT

# Database configuration
DB_USER=localuser
DB_PASS=localpass
DB_HOST=localhost
DB_PORT=5432
DB_NAME=localdb

# JWT secret for local development
JWT_SECRET=local-jwt-secret-key

# Node environment
NODE_ENV=development
EOF

echo -e "${GREEN}✅ Created .env file for local development${NC}"

# Generate secure values for GitHub Secrets
echo -e "${YELLOW}🔑 Generating secure values for GitHub Secrets${NC}"

DB_PASS=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
JWT_SECRET=$(openssl rand -hex 64)

echo -e "${GREEN}📋 Add these secrets to your GitHub repository:${NC}"
echo ""
echo "1. Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions"
echo "2. Click 'New repository secret' and add each one:"
echo ""
echo "Secret Name: DB_USER"
echo "Secret Value: testuser"
echo ""
echo "Secret Name: DB_PASS"
echo "Secret Value: $DB_PASS"
echo ""
echo "Secret Name: DB_NAME"
echo "Secret Value: testdb"
echo ""
echo "Secret Name: DB_HOST"
echo "Secret Value: localhost"
echo ""
echo "Secret Name: DB_PORT"
echo "Secret Value: 5432"
echo ""
echo "Secret Name: JWT_SECRET"
echo "Secret Value: $JWT_SECRET"
echo ""

echo -e "${YELLOW}💡 After adding secrets, your GitHub Actions will use them automatically!${NC}"
echo -e "${YELLOW}💡 Your local development will use the .env file${NC}"
