import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { StoreProvider } from 'easy-peasy'
import './index.css'
import App from './App'
import store from './store'
import { HelmetProvider } from 'react-helmet-async'
import { coinbaseWallet, hooks as coinbaseWalletHooks } from './connectors/coinbaseWallet'
import { hooks as metaMaskHooks, metaMask } from './connectors/metaMask'
import { hooks as networkHooks, network } from './connectors/network'
import { hooks as walletConnectV2Hooks, walletConnectV2 } from './connectors/walletConnectV2'
import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import type { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import type { MetaMask } from '@web3-react/metamask'
import type { Network } from '@web3-react/network'
import type { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import { gnosisSafe, hooks } from '~/connectors/gnosisSafe'

if ('ethereum' in window) {
    ;(window.ethereum as any).autoRefreshOnNetworkChange = false
}

const connectors: [MetaMask | WalletConnectV2 | CoinbaseWallet | Network | GnosisSafe, Web3ReactHooks][] = [
    [metaMask, metaMaskHooks],
    [walletConnectV2, walletConnectV2Hooks],
    [coinbaseWallet, coinbaseWalletHooks],
    [network, networkHooks],
    [gnosisSafe, hooks],
]

ReactDOM.render(
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <Web3ReactProvider connectors={connectors}>
                    <StoreProvider store={store}>
                        <App />
                    </StoreProvider>
                </Web3ReactProvider>
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>,
    document.getElementById('root')
)
