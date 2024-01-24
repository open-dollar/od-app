# Use Node.js v16 as the base image to run this Dockerfile
FROM node:16 AS base

WORKDIR /od-app

COPY package.json ./
COPY .yarnrc.yml ./
COPY yarn.lock ./
COPY .yarn/ ./.yarn/

RUN yarn install

FROM base AS build

COPY craco.config.js ./
COPY tsconfig.json ./
COPY public/ public/
COPY src/ src/

ARG REACT_APP_NETWORK_ID
ARG REACT_APP_NETWORK_URL
ARG REACT_APP_WALLET_CONNECT_PROJECT_ID
ARG REACT_APP_FALLBACK_SUBGRAPH_URL
ARG REACT_APP_GEOFENCE_ENABLED

RUN yarn build

FROM node:16 AS production

COPY --from=build /od-app/build/ ./build/

RUN npm install -g serve

EXPOSE 3000:3000

CMD serve -s build