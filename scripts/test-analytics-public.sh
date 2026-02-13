#!/bin/bash

# Test 1: Public tracking with Valid Subdomain
echo "Test 1: Public tracking with Valid Subdomain (Safemom)"
curl -X POST http://localhost:3000/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"subdomain": "Safemom", "eventType": "page_view", "pagePath": "/test"}' \
  -w "\nHTTP Status: %{http_code}\n"
echo "---------------------------------------------------"

# Test 2: Public tracking with Invalid Subdomain
echo "Test 2: Public tracking with Invalid Subdomain"
curl -X POST http://localhost:3000/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"subdomain": "nonexistent_subdomain_12345", "eventType": "page_view"}' \
  -w "\nHTTP Status: %{http_code}\n"
echo "---------------------------------------------------"

# Test 3: Public tracking without Business Context
echo "Test 3: Public tracking without Business Context"
curl -X POST http://localhost:3000/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"eventType": "page_view"}' \
  -w "\nHTTP Status: %{http_code}\n"
echo "---------------------------------------------------"
