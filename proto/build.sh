#!/bin/bash
mkdir ./../client/src/generated
# Command to generate gRPC-Web and JavaScript files
protoc -I=. question.proto \
  --js_out=import_style=commonjs:./../client/src/generated \
  --grpc-web_out=import_style=commonjs,mode=grpcwebtext:./../client/src/generated \



