#!/bin/bash

# Test 1: Public tracking with Location Data
echo "Test 1: Public tracking with Location Data"
curl -X POST http://localhost:3000/analytics/track \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain": "Safemom",
    "eventType": "page_view",
    "pagePath": "/contact",
    "location": {
      "country": "Nigeria",
      "region": "Lagos",
      "city": "Ikeja"
    }
  }' \
  -w "\nHTTP Status: %{http_code}\n"
echo "---------------------------------------------------"

# Note: We can't easily test the GET endpoint without authentication token script, 
# but we can verify the track endpoint accepts the data without error.
