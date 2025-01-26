# gRPC Task Setup

## Prerequisites
- Node.js
- npm 
- Envoy Proxy

## Setup & Running
### 1. Frontend
```bash
cd client
npm install
npm start
```
### 2. Backend

```bash
cd server
npm install
npm start
```

### 3. Proxy

```bash
cd server
enovy -c envoy.yaml
```

