# Stage-1 & specify a name 'builder'

FROM node:latest AS builder

# Create a directory and go to the directory
WORKDIR /app

# Copy the package.json file to my current directory to install the necessary dependencies
COPY package.json .

# Install the dependencies
RUN npm install

# Copy other files to my current directory
COPY . .

# Build and optimize static file

RUN npm run build

# Stage-2 NGINX web server
FROM nginx:1.25.2-alpine-slim

# Copy the static file to my Nginx folder to serve static container
COPY --from=builder /app/dist /usr/share/nginx/html

# Open the port to react
EXPOSE 80

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

