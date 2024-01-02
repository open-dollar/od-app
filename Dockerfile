FROM node:16 AS base

WORKDIR /od-app
COPY package.json package.json
COPY .yarnrc.yml .yarnrc.yml
COPY yarn.lock yarn.lock
COPY .yarn .yarn
RUN yarn install

COPY public/ public
COPY src/ src
COPY . . 
RUN yarn build

FROM httpd:alpine AS runner

WORKDIR /var/www/html

COPY --from=base /od-app/build/ .
