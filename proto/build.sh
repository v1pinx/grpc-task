#!/bin/bash

# Command to generate gRPC-Web and JavaScript files
protoc -I=. question.proto \
  --js_out=import_style=commonjs:./generated \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:./generated \



