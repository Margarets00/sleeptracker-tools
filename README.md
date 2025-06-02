# SleepTracker Tools

Simple tool for getting SleepTracker bed info.

[한국어 문서](README_ko.md)

## Using NPX

```bash
npx sleeptracker-tools
```

## Using Shell Script

```bash
# Give execution permission
chmod +x sleeptracker-get-deviceId.sh

# Run
./sleeptracker-get-deviceId.sh
```

## Using Docker

```bash
# Give execution permission to docker script
chmod +x run-docker.sh

# Build and run
./run-docker.sh
```

Or manually with Docker commands:

```bash
# Build image
docker build -t sleeptracker-tools .

# Run
docker run -it --rm sleeptracker-tools
```

## Features

- Login with SleepTracker account
- Display connected bed list
- Show detailed information for each bed:
  - Bed ID
  - Name
  - Model
  - Firmware version
  - Status (active/inactive)
  - WiFi signal strength
  - Power base information (if available) 