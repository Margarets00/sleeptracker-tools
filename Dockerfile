FROM alpine:3.19

# Install curl and bash
RUN apk add --no-cache \
    curl \
    bash

# Create app directory
WORKDIR /app

# Copy shell script
COPY sleeptracker-get-deviceId.sh .

# Make script executable
RUN chmod +x sleeptracker-get-deviceId.sh

# Set entrypoint
ENTRYPOINT ["/app/sleeptracker-get-deviceId.sh"] 