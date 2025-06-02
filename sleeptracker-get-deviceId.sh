#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Function to print separator
print_separator() {
    echo -e "${GRAY}----------------------------------------${NC}"
}

# Function to extract JSON value
get_json_value() {
    local json="$1"
    local key="$2"
    echo "$json" | grep -o "\"$key\":\"[^\"]*\"" | cut -d'"' -f4
}

get_json_number() {
    local json="$1"
    local key="$2"
    echo "$json" | grep -o "\"$key\":[0-9]*" | cut -d':' -f2
}

get_json_boolean() {
    local json="$1"
    local key="$2"
    if echo "$json" | grep -q "\"$key\":true"; then
        echo "true"
    else
        echo "false"
    fi
}

# Read credentials
read -p "Enter your SleepTracker email: " email
read -s -p "Enter your password: " password
echo

# Create base64 encoded credentials
credentials=$(echo -n "${email}:${password}" | base64)

# Login to get token
echo -e "\nLogging in..."
login_response=$(curl -s -X POST "https://auth.tsi.sleeptracker.com/v1/app/user/session" \
    -H "Authorization: Basic ${credentials}" \
    -H "Content-Type: application/json" \
    -H "Accept: */*" \
    -H "Accept-Encoding: gzip" \
    -H "Accept-Language: en-US,en;q=0.9" \
    -H "Host: auth.tsi.sleeptracker.com" \
    -d '{
        "clientID": "sleeptracker-android-tsi",
        "clientVersion": "1.9.47",
        "id": "TEST_ANDROID_getUserSession",
        "scope": "scope"
    }')

# Extract token from response
token=$(get_json_value "$login_response" "token")

if [ -z "$token" ]; then
    echo -e "${RED}Login failed${NC}"
    exit 1
fi

echo -e "${GREEN}Login successful!${NC}"

# Get devices
devices_response=$(curl -s -X POST "https://app.tsi.sleeptracker.com/actrack-client/v2/fpcsiot/processor/getByType" \
    -H "Authorization: Bearer ${token}" \
    -H "Content-Type: application/json" \
    -H "Accept: */*" \
    -H "Accept-Encoding: gzip" \
    -H "Accept-Language: en-US,en;q=0.9" \
    -H "Host: app.tsi.sleeptracker.com" \
    -d '{
        "clientID": "sleeptracker-android-tsi",
        "clientVersion": "1.9.47",
        "id": "TEST_ANDROID_cloudIoTDevicesGetByType",
        "types": [1, 2, 4, 6]
    }')

# Check if devices were found and process each device
if echo "$devices_response" | grep -q '"deviceList":\['; then
    echo -e "\n${GREEN}Connected beds:${NC}\n"
    
    # Split the response into individual devices
    echo "$devices_response" | tr '{' '\n' | while read -r line; do
        if echo "$line" | grep -q '"deviceID"'; then
            # Extract device information
            device_id=$(get_json_number "$line" "deviceID")
            name=$(get_json_value "$line" "name")
            model=$(get_json_value "$line" "modelID")
            firmware=$(get_json_value "$line" "processorVersionFirmware")
            active=$(get_json_boolean "$line" "active")
            wifi_signal=$(get_json_number "$line" "lastWiFiSignal")
            wifi_good=$(get_json_boolean "$line" "wifiSignalGood")
            power_base_model=$(echo "$line" | grep -o '"modelDescription":"[^"]*"' | cut -d'"' -f4)

            # Display device information
            echo -e "${YELLOW}Bed ID: ${NC}$device_id"
            echo -e "${YELLOW}Name: ${NC}$name"
            echo -e "${YELLOW}Model: ${NC}$model"
            echo -e "${YELLOW}Firmware: ${NC}$firmware"
            echo -e "${YELLOW}Status: ${NC}$([[ "$active" == "true" ]] && echo "Active" || echo "Inactive")"
            echo -e "${YELLOW}WiFi Signal: ${NC}${wifi_signal}% ($([[ "$wifi_good" == "true" ]] && echo "Good" || echo "Poor"))"
            if [ ! -z "$power_base_model" ]; then
                echo -e "${YELLOW}Power Base: ${NC}$power_base_model"
            fi
            print_separator
        fi
    done
else
    echo -e "${RED}No beds found${NC}"
    exit 1
fi 