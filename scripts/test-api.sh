#!/bin/bash

# Test script for running Postman tests locally
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🧪 Running Postman API Tests${NC}"

# Check if Newman is installed
if ! command -v newman &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Newman...${NC}"
    npm install -g newman
fi

# Check if backend is running
if ! curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${RED}❌ Backend is not running. Please start it first:${NC}"
    echo -e "${YELLOW}   cd backend && docker-compose up${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend is running${NC}"

# Run the tests
echo -e "${YELLOW}🔍 Running Postman tests...${NC}"
cd backend

newman run tests/postman_collection.json \
  -e tests/postman_environment.json \
  --reporters cli,json \
  --reporter-json-export test-results.json

# Check if tests passed
if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
else
    echo -e "${RED}❌ Some tests failed. Check the output above.${NC}"
    exit 1
fi
