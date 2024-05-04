<p align="center">
<img width="60" height="60"  src="https://raw.githubusercontent.com/open-dollar/.github/main/od-logo.svg">
</p>
<h1 align="center">
  OD App
</h1>

<p align="center">
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg" />
  </a>
  <a href="https://twitter.com/open_dollar" target="_blank">
    <img alt="Twitter: open_dollar" src="https://img.shields.io/twitter/follow/open_dollar.svg?style=social" />
  </a>
</p>

Frontend application for Open Dollar

<!-- - Website: [Open Dollar](https://www.opendollar.com/)
- App: [Open Dollar App](https://app.opendollar.com/#/)
- Docs: [Open Dollar Docs](https://docs.opendollar.com/)
- Twitter: [@open_dollar](https://twitter.com/open_dollar)
- Discord: [Open Dollar](https://discord.gg/GjDQ5HaAR4)
-->

# Deployments

https://app.opendollar.com/ Production `main` branch

https://app.dev.opendollar.com/ Testnet `dev` branch

# ⚡️ Run the app locally

For security and resiliency we publish the app as a self-contained Docker image 

1. Install [Docker](https://docs.docker.com/desktop/)
2. Get the latest [Release](https://github.com/open-dollar/od-app/releases), eg. `1.5.9`
3. Run the start command, replacing `<VERSION_NUMBER>` with the release

```bash
docker run -p 3000:3000 ghcr.io/open-dollar/od-app:<VERSION_NUMBER>
# For example:
docker run -p 3000:3000 ghcr.io/open-dollar/od-app:1.6.5-rc.2
```

The application will be available on http://localhost:3000

> For network Arbitrum Sepolia, use a release candidate (eg. 1.2.0-rc.abc123) version from the [container registry](https://github.com/open-dollar/od-app/pkgs/container/od-app)

# Development

## Setup

Install dependencies

```bash
yarn
```

Setup the environment by creating the file `.env.development.local`:

```bash
cp example.env .env.development.local
```

Start the app

```bash
yarn start
```

If you have issues, check you are using node v16

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

## Docker

### Build the image locally

For Arbitrum-Sepolia:

```bash
docker build --build-arg REACT_APP_NETWORK_ID=421614 \
--build-arg REACT_APP_NETWORK_URL=https://arbitrum-sepolia.blockpi.network/v1/rpc/public \
--build-arg REACT_APP_WALLET_CONNECT_PROJECT_ID=fb1d2dba2f157d3d719134e58dda98a7 \
-t open-dollar/od-app .
```

For Arbitrum One:

```bash
docker build --build-arg REACT_APP_NETWORK_ID=42161 \
--build-arg REACT_APP_NETWORK_URL=https://arbitrum.blockpi.network/v1/rpc/public \
--build-arg REACT_APP_WALLET_CONNECT_PROJECT_ID=fb1d2dba2f157d3d719134e58dda98a7 \
-t open-dollar/od-app .
```
