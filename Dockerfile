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


# Add ARG for each environment variable
ARG REACT_APP_NETWORK_ID
ARG REACT_APP_NETWORK_URL
ARG REACT_APP_FALLBACK_SUBGRAPH_URL
ARG REACT_APP_GEOFENCE_ENABLED

# Set ENV for each environment variable
ENV REACT_APP_NETWORK_ID=${REACT_APP_NETWORK_ID}
ENV REACT_APP_NETWORK_URL=${REACT_APP_NETWORK_URL}
ENV REACT_APP_FALLBACK_SUBGRAPH_URL=${REACT_APP_FALLBACK_SUBGRAPH_URL}
ENV REACT_APP_GEOFENCE_ENABLED=${REACT_APP_GEOFENCE_ENABLED}

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

# Set the working directory cursor to the default Apache directory
WORKDIR /usr/local/apache2/htdocs/

# Copy the build directory from base stage to the runner stage
COPY --from=base /od-app/build/ .
