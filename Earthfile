VERSION 0.6
FROM node:16
WORKDIR /app

deps:
    COPY package.json .
    COPY yarn.lock .
    COPY .nvmrc .
    COPY .yarnrc.yml .yarnrc.yml
    COPY .yarn .yarn
    COPY src src
    COPY craco.config.js craco.config.js
    COPY tsconfig.json tsconfig.json
    COPY public public
    # needed for package's deps as well
    RUN yarn set version 3.2.3
    RUN yarn
    # Output these back in case yarn install changes them.
    SAVE ARTIFACT package.json AS LOCAL ./package.json
    SAVE ARTIFACT yarn.lock AS LOCAL ./yarn.lock

test:
    FROM +deps
    RUN yarn lint
    RUN yarn test

build-app:
    FROM +deps
    ARG ENVIRONMENT='local'
    ARG VERSION='latest'
    RUN yarn craco build
