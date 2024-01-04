# Use Node.js v16 as the base image to run this Dockerfile
FROM node:16 AS base

# Set the working directory cursor to /od-app
WORKDIR /od-app

# Copy the following files and directories to the Docker image to work correctly with yarn install command.
COPY package.json ./
COPY .yarnrc.yml ./
COPY yarn.lock ./
COPY .yarn/ ./.yarn/
# NOTE: This is a workaround but we can reduce the size of the Docker image by removing the following line.
COPY . ./

# Install the application dependencies
RUN yarn install

# Copy the source code to the Docker image
COPY public/ public/
COPY src/ src/

# Build the application
RUN yarn build

# Runner stage
# Use Apache HTTP server Alpine variant image to run the built application
FROM httpd:alpine AS runner

# Set the working directory cursor to /var/www/html
WORKDIR /var/www/html

# Copy the build directory from base stage to the runner stage
COPY --from=base /od-app/build/ .
