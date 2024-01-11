# Use Node.js v16 as the base image to run this Dockerfile
FROM node:16 AS base

# Set the working directory cursor to /od-app
WORKDIR /od-app

# Copy the following files and directories to the Docker image to work correctly with yarn install command.
COPY package.json ./
COPY .yarnrc.yml ./
COPY yarn.lock ./
COPY .yarn/ ./.yarn/
COPY craco.config.js ./
COPY tsconfig.json ./

# Install the application dependencies
RUN yarn install

# Copy the source code to the Docker image
COPY public/ public/
COPY src/ src/

# Start the application
CMD ["yarn", "start"]
