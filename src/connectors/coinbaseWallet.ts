import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector } from '@web3-react/core'

import { URLS } from '../chains'

export const [coinbaseWallet, hooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {

        url: URLS[parseInt(process.env.REACT_APP_NETWORK_ID || '0')][0],
        appName: 'od-on-op',
      },
    })
)