#!/bin/bash

# Configuration
BACKEND_PORT=8003

# Function to check if port is in use
is_port_occupied() {
  local port=$1
  netstat -ano | findstr ":$port " | findstr "LISTENING" > /dev/null
  return $?
}

# Function to get process using port
get_process_using_port() {
  local port=$1
  netstat -ano | findstr ":$port " | findstr "LISTENING" | awk '{ print $NF }'
}

# Function to wait for port to be free
wait_for_port_to_free() {
  local port=$1
  local max_retries=10
  local retry_count=0

  while [ $retry_count -lt $max_retries ]; do
    if ! is_port_occupied $port; then
      return 0
    fi
    echo "Waiting for port $port to be freed..."
    sleep 2
    retry_count=$((retry_count + 1))
  done

  return 1
}

# Function to kill process by port
kill_process_on_port() {
  local port=$1
  local max_retries=3
  local retry_count=0

  while [ $retry_count -lt $max_retries ]; do
    if ! is_port_occupied $port; then
      return 0
    fi

    local pid=$(get_process_using_port $port)
    if [ -n "$pid" ]; then
      echo "Attempting to kill process with PID $pid on port $port..."
      taskkill //PID $pid //F
      sleep 3
    fi

    retry_count=$((retry_count + 1))
  done

  return 1
}

# Function to check backend health
check_backend_health() {
  local max_retries=15
  local retry_count=0

  while [ $retry_count -lt $max_retries ]; do
    if curl -s http://localhost:$BACKEND_PORT/docs > /dev/null; then
      return 0
    fi
    echo "Waiting for backend to become healthy... (attempt $((retry_count + 1))/$max_retries)"
    sleep 2
    retry_count=$((retry_count + 1))
  done

  return 1
}

# Function to start frontend
start_frontend() {
  echo "Starting frontend..."
  cd frontend/openmanus-ui
  npm run dev &
  cd ../..
  echo "Frontend started"
}

# Function to start backend
start_backend() {
  echo "Starting backend..."
  uvicorn app.api:app --host 0.0.0.0 --port $BACKEND_PORT --reload &
  echo "Backend started"
}

# Kill any processes using required ports
echo "Checking for processes using required ports..."
if is_port_occupied $BACKEND_PORT; then
  echo "Port $BACKEND_PORT is in use. Attempting to free it..."
  if ! kill_process_on_port $BACKEND_PORT; then
    echo "Error: Failed to free port $BACKEND_PORT"
    exit 1
  fi
fi

if is_port_occupied 5174; then
  echo "Port 5174 is in use. Attempting to free it..."
  if ! kill_process_on_port 5174; then
    echo "Error: Failed to free port 5174"
    exit 1
  fi
fi

# Wait for ports to be completely free
echo "Waiting for ports to be freed..."
wait_for_port_to_free $BACKEND_PORT || { echo "Error: Port $BACKEND_PORT is still in use"; exit 1; }
wait_for_port_to_free 5174 || { echo "Error: Port 5174 is still in use"; exit 1; }

# Start services in correct order
start_backend

# Wait for backend to become healthy
echo "Waiting for backend to become healthy..."
if ! check_backend_health; then
  echo "Error: Backend failed to start or become healthy"
  echo "Please check the backend logs for more information"
  exit 1
fi

start_frontend

echo "Services started successfully!"
echo "Backend running at http://localhost:$BACKEND_PORT"
echo "Frontend running at http://localhost:5174"
