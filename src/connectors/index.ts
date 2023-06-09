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
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { NetworkConnector } from './NetworkConnector'

const { REACT_APP_NETWORK_ID, REACT_APP_NETWORK_URL } = process.env

export const NETWORK_URL = REACT_APP_NETWORK_URL as string

export const NETWORK_ID = parseInt(REACT_APP_NETWORK_ID ?? '1')

export const network = new NetworkConnector({
    urls: { [NETWORK_ID]: NETWORK_URL },
    defaultChainId: NETWORK_ID,
})

export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42],
})

export const gnosisSafe = new SafeAppConnector()

// mainnet only
export const walletconnect = new WalletConnectConnector({
    rpc: { [NETWORK_ID]: NETWORK_URL },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: 15000,
})

// mainnet only
export const walletlink = new WalletLinkConnector({
    url: NETWORK_URL,
    appName: 'Reflexer',
    appLogoUrl:
        'https://gblobscdn.gitbook.com/spaces%2F-M9jdHretGKCtWYz5jZR%2Favatar-1593281271873.png?alt=media',
})
