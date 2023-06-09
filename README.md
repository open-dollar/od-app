<!-- AUTO-GENERATED-CONTENT:START (STARTER) -->
<p align="center">
  <a href="https://reflexer.finance" target="_blank">
    <img alt="Reflexer" src="https://i.ibb.co/CtWRHQd/android-chrome-512x512.png" width="60" />
  </a>
</p>
<h1 align="center">
  Reflexer App
</h1>

Deposit your crypto assets, generate RAI and lever up your position.

- Website: [reflexer.finance](https://reflexer.finance/)
- App: [app.reflexer.finance](https://app.reflexer.finance)
- Analytics: [stats.reflexer.finance](https://stats.reflexer.finance/)
- Tokenomics: [tokenomics.reflexer.finance](https://tokenomics.reflexer.finance/)
- Docs: [docs.reflexer.finance](https://docs.reflexer.finance/)
- Twitter: [@reflexerfinance](https://twitter.com/reflexerfinance)
- Discord: [Reflexer](https://discord.com/invite/83t3xKT)
- Whitepaper: [Link](https://github.com/reflexer-labs/whitepapers/blob/master/English/rai-english.pdf)

## Accessing the Uniswap Interface

To access the Reflexer Interface, use an IPFS gateway link from the
[latest release](https://github.com/reflexer-labs/geb-app/releases/latest),
or visit [https://app.reflexer.finance](https://app.reflexer.finance).


## Development

### Install Dependencies

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
2. Change `REACT_APP_NETWORK_ID` to `"42"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://kovan.infura.io/v3/{YOUR_INFURA_KEY}"`
4. Change `REACT_APP_COIN_TICKER_STAGING` to `"RAI"`
4. Change `REACT_APP_SHOW_AUCTIONS` to `"1"`

## Testing

### Cypress integration test

```bash
yarn test:e2e
```

### Jest test

```bash
yarn test
```
