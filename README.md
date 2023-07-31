<p align="center">
  <a href="https://reflexer.finance" target="_blank">
    <img alt="Reflexer" src="https://i.ibb.co/CtWRHQd/android-chrome-512x512.png" width="60" />
  </a>
</p>
<h1 align="center">
  OD App
</h1>

Deposit your crypto assets, generate OD and lever up your position.

<!-- - Website: [reflexer.finance](https://reflexer.finance/)
- App: [app.reflexer.finance](https://app.reflexer.finance)
- Docs: [docs.reflexer.finance](https://docs.reflexer.finance/)
- Twitter: [@reflexerfinance](https://twitter.com/reflexerfinance)
- Discord: [Reflexer](https://discord.com/invite/83t3xKT)
- Whitepaper: [Link](https://github.com/reflexer-labs/whitepapers/blob/master/English/hai-english.pdf) -->

## Deployments

http://app.opendollar.com/
dev branch http://app.optimism-goerli.opendollar.com/
https://open-dollar-app.vercel.app/

## Development

### Install Dependencies
```bash
yarn prebuild
```

```bash
yarn build
```

```bash
yarn
```

### Run

```bash
yarn start
```

### Configuring the environment

To have the app default to a different network when a wallet is not connected:

1. Create a file and name it `.env.development.local`
2. Change `REACT_APP_NETWORK_ID` to `"420"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://opt-goerli.g.alchemy.com/v2/{YOUR_INFURA_KEY}"`

### Configuring the devlink

1. Create `.webflowrc.js` file in a root directory
```js
module.exports = {
    host: "https://api.webflow.com",
    rootDir: "./src/devlink",
    siteId: "64ac4f0e4fd899bd9c0009aa",
    authToken: "{YOUR_WF_AUTH_TOKEN}", // An environment variable is recommended for this field.
    cssModules: true,
};
```

2. To sync your Webflow components into your project run

```bash
npx webflow devlink sync
```

## Testing

### Cypress integration test

```bash
yarn test:e2e
```

### Jest test

```bash
yarn test
```
