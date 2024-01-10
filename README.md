<p align="center">
  <svg width="60" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.26508 16C12.6833 16 16.2651 12.4183 16.2651 8.00001C16.2651 3.58173 12.6833 1.52588e-05 8.26508 1.52588e-05V16Z" fill="#43C7FF"/>
<path d="M8.26508 -1.90735e-06C3.8468 -2.29361e-06 0.265086 3.58172 0.265086 7.99999C0.265086 12.4183 3.8468 16 8.26508 16L8.26508 -1.90735e-06Z" fill="#0079AD"/>
<ellipse cx="8.26509" cy="7.99998" rx="5.33333" ry="5.33333" fill="#002B40"/>
<path d="M8.26508 10.6666C9.73782 10.6666 10.9317 9.47271 10.9317 7.99997C10.9317 6.52722 9.73782 5.33333 8.26508 5.33333V10.6666Z" fill="#0079AD"/>
<path d="M8.26508 5.3334C6.79234 5.3334 5.59845 6.52729 5.59845 8.00003C5.59845 9.47277 6.79234 10.6667 8.26508 10.6667L8.26508 5.3334Z" fill="#43C7FF"/>
</svg>

</p>
<h1 align="center">
  OD App
</h1>

Deposit your crypto assets, generate OD and lever up your position.

<!-- - Website: [Open Dollar](https://www.opendollar.com/)
- App: [Open Dollar App](https://app.opendollar.com/#/)
- Docs: [Open Dollar Docs](https://docs.opendollar.com/)
- Twitter: [@open_dollar](https://twitter.com/open_dollar)
- Discord: [Open Dollar](https://discord.gg/GjDQ5HaAR4)
-->

## Deployments

http://app.opendollar.com/
dev branch http://app.optimism-goerli.opendollar.com/
https://open-dollar-app.vercel.app/

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn prebuild
```

```bash
yarn build
```

```bash
yarn start
```

## Configuring the environment

To have the app default to a different network when a wallet is not connected:

1. Create a file and name it `.env.development.local`
2. Change `REACT_APP_NETWORK_ID` to `"420"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://opt-goerli.g.alchemy.com/v2/{YOUR_INFURA_KEY}"`
4. Change `REACT_APP_FALLBACK_SUBGRAPH_URL` to actual values in the format `https://${GRAPH_NODE_PLAYGROUND_BASE_URL}/subgraphs/name/NAME_OF_YOUR_SUBGRAPH`
The current value of the `GRAPH_NODE_PLAYGROUND_BASE_URL` in the Render-deployed subgraph can be found in the Render dashboard under the Environment section of the NGINX Render service.
The subgraph name can be queried in the Render database service by following the `README.md` instructions in the [od-subgraph](https://github.com/open-dollar/od-subgraph) repo.

### Subgraph Redundancy

When a request fails to our hosted subgraph in The Graph, we will automatically retry the request to our Render-hosted subgraph
in the `querySubgraph` SDK function. Make sure you've set `REACT_APP_FALLBACK_SUBGRAPH_URL` as a .env variable to ensure
there's a fallback subgraph to query.

## Testing

### Cypress integration test

```bash
yarn test:e2e
```

### Jest test

```bash
yarn test
```

## Docker Compose

##### Dockerfile Overview:
1. **Base setup:**
Uses node:16 as the base image.
Sets a working directory at /od-app.
2. **Dependency management:**
Copies files and directories relevant to Yarn and app dependencies.
Runs yarn install to install the necessary dependencies.
3. **Environment variables:**
Sets up various build-time and run-time variables.
4. **App build:**
Copies app source code into the Docker image.
Runs yarn build to build the application.
5. **Runner setup:**
Switches to httpd:alpine as the base image for the runner stage.
Sets a working directory in the Apache server's filesystem.
Copies the built application from the first stage to the runner stage, making it ready to operate using Apache HTTP Server.
##### Running the Services:
Run the docker compose and set the environment variables via CLI arguments and take account the "Configuring the environment" section above:
```bash
REACT_APP_NETWORK_ID=XXXX REACT_APP_NETWORK_URL=XXXX docker-compose up --build
```
You'll be able to access the application on http://localhost:8080.
##### Stopping the Services:
```bash
docker-compose down
```
