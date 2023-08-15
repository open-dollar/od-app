import { initializeConnector } from '@web3-react/core'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'

import {CHAINS} from '../chains'

const supportedChainId = parseInt(process.env.REACT_APP_NETWORK_ID || '', 10);

if (isNaN(supportedChainId) || !CHAINS[supportedChainId]) {
    throw new Error(`Unsupported chain ID ${supportedChainId}`);
}

export const [walletConnectV2, hooks] = initializeConnector<WalletConnectV2>(
  (actions) =>
    new WalletConnectV2({
      actions,
      options: {
        projectId: 'c8d728041790027d6469878911bff5cf',
        chains: [supportedChainId],
        showQrModal: true,
      },
    })
)
