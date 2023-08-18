// Copyright (C) 2023  Uniswap
// https://github.com/Uniswap/web3-react

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

import { initializeConnector } from '@web3-react/core'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'

import { CHAINS } from '../chains'

const supportedChainId = parseInt(process.env.REACT_APP_NETWORK_ID || '', 10)

if (isNaN(supportedChainId) || !CHAINS[supportedChainId]) {
    throw new Error(`Unsupported chain ID ${supportedChainId}`)
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
