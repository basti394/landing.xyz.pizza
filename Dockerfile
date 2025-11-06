# Stage 1: Use a lightweight Nginx image as the base
# Nginx is a high-performance web server perfect for serving static content.
FROM nginx:1.25-alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Copy all the website files from your project into the Nginx public directory.
# The source path '.' refers to the build context (your project folder).
# The destination path '.' refers to the current WORKDIR.
COPY . .

# Expose port 80, which is the default port for HTTP traffic that Nginx listens on.
EXPOSE 80

# The default command for the nginx image is to start the server, so no CMD is needed.
