#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Build docker image
echo -e "${GREEN}Building Docker image...${NC}"
docker build -t sleeptracker-tools .

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}Running SleepTracker Tools...${NC}"
    docker run -it --rm sleeptracker-tools
else
    echo -e "\n${RED}Failed to build Docker image${NC}"
    exit 1
fi 