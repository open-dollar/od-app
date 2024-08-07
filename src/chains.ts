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

import type { AddEthereumChainParameter } from '@web3-react/types'

const RPC_URL = process.env.REACT_APP_NETWORK_URL as string
const NETWORK_ID = process.env.REACT_APP_NETWORK_ID as string

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
}

export const RPC_URL_ETHEREUM = process.env.REACT_APP_RPC_URL_ETHEREUM
    ? process.env.REACT_APP_RPC_URL_ETHEREUM
    : 'https://eth.llamarpc.com'
export const RPC_URL_ARBITRUM = RPC_URL || 'https://arbitrum.blockpi.network/v1/rpc/public'
export const RPC_URL_OPTIMISM = 'https://op-pokt.nodies.app'
export const RPC_URL_POLYGON = 'https://polygon-bor-rpc.publicnode.com'
export const RPC_URL_BASE = 'https://base.llamarpc.com'

interface BasicChainInformation {
    urls: string[]
    name: string
}

interface ExtendedChainInformation extends BasicChainInformation {
    nativeCurrency: AddEthereumChainParameter['nativeCurrency']
    blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
}

function isExtendedChainInformation(
    chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
    return !!(chainInformation as ExtendedChainInformation).nativeCurrency
}

export function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
    const chainInformation = CHAINS[chainId]
    if (isExtendedChainInformation(chainInformation)) {
        return {
            chainId,
            chainName: chainInformation.name,
            nativeCurrency: chainInformation.nativeCurrency,
            rpcUrls: chainInformation.urls,
            blockExplorerUrls: chainInformation.blockExplorerUrls,
        }
    } else {
        return chainId
    }
}

type ChainConfig = { [chainId: number]: BasicChainInformation | ExtendedChainInformation }
export const MAINNET_CHAINS: ChainConfig = {
    42161: {
        urls: [RPC_URL, RPC_URL_ARBITRUM],
        name: 'Arbitrum One',
        nativeCurrency: ETH,
        blockExplorerUrls: ['https://arbiscan.io'],
    },
    10: {
        urls: [RPC_URL_OPTIMISM],
        name: 'Optimism Mainnet',
        nativeCurrency: ETH,
        blockExplorerUrls: ['https://optimistic.etherscan.io'],
    },
}

export const TESTNET_CHAINS: ChainConfig = {
    421614: {
        urls: [RPC_URL, 'https://arbitrum-sepolia.blockpi.network/v1/rpc/public'],
        name: 'Arbitrum Sepolia',
        nativeCurrency: ETH,
        blockExplorerUrls: ['https://sepolia.arbiscan.io/'],
    },
}

const supportedChainId = parseInt(NETWORK_ID || '', 10)

if (isNaN(supportedChainId)) {
    throw new Error('REACT_APP_NETWORK_ID must be a valid number')
}

export const CHAINS: ChainConfig = {
    [supportedChainId]: {
        ...(MAINNET_CHAINS[supportedChainId] || TESTNET_CHAINS[supportedChainId]),
    },
}

if (!CHAINS[supportedChainId]) {
    throw new Error(`Unsupported chain ID ${supportedChainId}`)
}

export const URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce<{ [chainId: number]: string[] }>(
    (accumulator, chainId) => {
        const validURLs: string[] = CHAINS[Number(chainId)].urls

        if (validURLs.length) {
            accumulator[Number(chainId)] = validURLs
        }

        return accumulator
    },
    {}
)
