FROM nginx:stable-alpine

# Create the certs directory
RUN mkdir -p /etc/nginx/certs

# Copy SSL certificates from the host to the container
COPY ./data/certs /etc/nginx/certs


