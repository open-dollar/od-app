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

### Configuring the environment

To have the app default to a different network when a wallet is not connected:

1. Create a file and name it `.env.development.local`
2. Change `REACT_APP_NETWORK_ID` to `"420"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://opt-goerli.g.alchemy.com/v2/{YOUR_INFURA_KEY}"`

## Testing

### Cypress integration test

```bash
yarn test:e2e
```

### Jest test

```bash
yarn test
```
