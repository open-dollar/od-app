// Copyright (C) 2020  Uniswap
// https://github.com/Uniswap/uniswap-interface

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { NetworkConnector } from './NetworkConnector'
import { Buffer } from 'buffer'
// @ts-ignore
import { util } from 'util'
import { initializeConnector } from '@web3-react/core'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'

const { REACT_APP_NETWORK_ID, REACT_APP_NETWORK_URL } = process.env

// @ts-ignore
if (!window.Buffer) {
    // @ts-ignore
    window.Buffer = Buffer
}

// @ts-ignore
if (!window.util) {
    // @ts-ignore
    window.util = util
}

export const NETWORK_URL = REACT_APP_NETWORK_URL as string

export const NETWORK_ID = parseInt(REACT_APP_NETWORK_ID ?? '1')

export const network = new NetworkConnector({
    urls: { [NETWORK_ID]: NETWORK_URL },
    defaultChainId: NETWORK_ID,
})

export const injected = new InjectedConnector({
    supportedChainIds: [420],
})

const TESTNET_CHAINS = {
    1: 'mainnet',
    3: 'ropsten',
}

const [testnet, ...optionalChains] = Object.keys(TESTNET_CHAINS).map(Number)

export const walletconnect = initializeConnector<WalletConnectV2>(
    (actions) =>
        new WalletConnectV2({
            actions,
            options: {
                projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID as string,
                chains: [testnet, ...optionalChains],
                optionalChains,
                showQrModal: true,
            },
        })
)

// mainnet only
export const walletlink = new WalletLinkConnector({
    url: NETWORK_URL,
    appName: 'Open Dollar',
    appLogoUrl: 'https://gblobscdn.gitbook.com/spaces%2F-M9jdHretGKCtWYz5jZR%2Favatar-1593281271873.png?alt=media',
})
