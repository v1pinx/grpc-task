# Assignment Setup

This assignment demonstrates a gRPC-based task management system with a frontend and backend implementation. The frontend interacts with the backend using gRPC APIs, and the setup includes an Envoy proxy for handling gRPC requests.

## Prerequisites

Before setting up the project, ensure you have the following installed:

-   **Node.js** 
-   **npm**
-   **Envoy Proxy**
-   **Docker** & **Docker Compose** (optional, for using Docker images)

----------

## Setup & Running (Using @grpc-web/proxy)

### 1. Clone the Repository

```bash
git clone https://github.com/v1pinx/grpc-task
cd grpc-task
```

### 2. Frontend Setup

1.  Navigate to the `client` directory:
    
    ```bash
    cd client
    ```
    
2.  Install dependencies:
    
    ```bash
    npm install
    ```
    
3.  Create a `.env` file in the `client` directory, and copy the content from `.env.example` into the new `.env` file.
    
4.  Start the frontend:
    
    ```bash
    npm start
    ```
    

### 3. Backend Setup

1.  Navigate to the `server` directory:
    
    ```bash
    cd ../server
    ```
    
2.  Install dependencies:
    
    ```bash
    npm install
    ```
    
3.  Create a `.env` file in the `server` directory, and copy the content from `.env.example` into the new `.env` file.
    
4.  Update the `MONGODB_URI` in the `.env` file with your own MongoDB URI or use the following for testing purposes:
    
    ```env
    mongodb+srv://read-only-user-1:TpbAGI4xwW1n6YMB@cluster0.jnbgy.mongodb.net
    ```
    Note: Use responsibly.
    
5.  Start the backend:
    
    ```bash
    npm start
    ```
    The server starts, but you won't be able to access the API responses directly in a browser because gRPC uses HTTP/2, which browsers cannot natively interact with for API calls. To resolve this, set up a gRPC-Web Proxy that listens on port 8080 and forwards requests to the gRPC server running on localhost:9090. This enables browser-based gRPC-Web clients to communicate with the gRPC server.
    ```bash
    npx @grpc-web/proxy --target http://localhost:9090 --listen 8080
    ```
    
    The proxy handles HTTP/1.1 requests from the browser, converts them to HTTP/2 for gRPC, and relays responses back to the browser in HTTP/1.1.
    

---------
## Setup & Running (Using Docker)

### 1. Frontend Setup

1.  Clone the repository and navigate to the `client` directory:
    
    ```bash
    git clone https://github.com/v1pinx/grpc-task
    cd grpc-task/client
    ```
    
2.  Install dependencies:
    
    ```bash
    npm install
    ```
    
3.  Create a `.env` file in the `client` directory, and copy the content from `.env.example` into the new `.env` file.
    
4.  Start the frontend:
    
    ```bash
    npm start
    ```
    

### 2. Running with Docker (gRPC Node server and Envoy Proxy)

1.  Ensure you are in the root directory, where the `docker-compose.yml` file is located.
    
2.  Update the MONGODB_URI with your MONGODB_URI in `docker-compose.yml` or  use the following for testing purposes:
	```
	mongodb+srv://read-only-user-1:TpbAGI4xwW1n6YMB@cluster0.jnbgy.mongodb.net
	```
	Note: Use responsibly.
    
4.  Run Docker Compose to start the services:
    
    ```bash
    docker compose up
    ```
    
    The server will be running at `http://localhost:9090`, but calls should be made to the Envoy proxy at `http://localhost:8080` to ensure compatibility with browsers that do not support HTTP/2.
----------

## Notes

-   **MongoDB URI**: Make sure to replace the `MONGODB_URI` in the `.env` and `docker-compose.yml` file with your own MongoDB connection string. You can also use the provided test URI for testing purposes only.
-   **Envoy Proxy**: The Envoy proxy is responsible for handling HTTP/2 traffic from the client and converting it to HTTP/1.1 for compatibility with browsers or clients that do not support HTTP/2.
