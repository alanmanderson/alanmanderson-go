# Use the official Go image as the base
FROM golang:1.19-alpine AS builder

COPY server /goapp/server

FROM ubuntu:latest

# Set the working directory inside the container
WORKDIR /goapp

# Copy the Go module files
#COPY go.mod go.sum ./
COPY --from=builder /goapp/server .

# Download the dependencies
# RUN go mod download

# Copy the rest of the application code
# COPY . .

# Set the entry point command to run the Go binary
#CMD ["./server"]
ENTRYPOINT ["./server"]
