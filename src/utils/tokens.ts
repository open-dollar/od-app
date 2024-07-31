import WETH from '../assets/eth.svg'
import OP from '../assets/op-img.svg'
import OD from '../assets/od-token.svg'
import ODG from '../assets/odg-token.svg'
import GRT from '../assets/grt.svg'
import PT_wstETH_26JUN2025 from '../assets/pendle-pt-wsteth.svg'
import PT_rETH_26JUN2025 from '../assets/pendle-pt-reth.svg'
import WSTETH from '../assets/wsteth.svg'
import CBETH from '../assets/cbETH.svg'
import RETH from '../assets/rETH.svg'
import ARB from '../assets/arb.svg'
import MAGIC from '../assets/magic.svg'
import PUFETH from '../assets/pufeth.svg'
import FALLBACK_TOKEN_ICON from '../assets/unknown-token.svg'

import { Provider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import { ERC20__factory } from '@opendollar/sdk/lib/typechained'
import { RPC_URL_ETHEREUM, RPC_URL_ARBITRUM, RPC_URL_OPTIMISM, RPC_URL_POLYGON, RPC_URL_BASE } from '~/chains'

export type Tokens = {
    [key: string]: {
        name: string
        icon: string
        gebName: string
        balance: string
        address: string
    }
}

export function getTokenLogo(token: string): string {
    const TOKEN_LOGOS: { [key: string]: string } = {
        WETH: WETH,
        OP: OP,
        OD: OD,
        ODG: ODG,
        WSTETH: WSTETH,
        CBETH: CBETH,
        RETH: RETH,
        ARB: ARB,
        MAGIC: MAGIC,
        PUFETH: PUFETH,
        GRT: GRT,
        ETH: WETH,
        'PT-rETH-26JUN2025': PT_rETH_26JUN2025,
        'PT-wstETH-26JUN2025': PT_wstETH_26JUN2025,
    }
    return TOKEN_LOGOS[token] || FALLBACK_TOKEN_ICON
}

const gasTokenArray = [
    '0x0000000000000000000000000000000000000000',
    '0x4200000000000000000000000000000000000042',
    '0x0000000000000000000000000000000000001010',
]

export const bridgeTokens: any = {
    42161: {
        tokens: [
            {
                name: 'ETH',
                icon: WETH,
                gebName: 'Ether',
                balance: '0',
                address: '0x0000000000000000000000000000000000000000',
            },
            {
                name: 'WSTETH',
                icon: WSTETH,
                gebName: 'Wrapped Staked Ether',
                balance: '0',
                address: '0x5979d7b546e38e414f7e9822514be443a4800529',
            },
            {
                name: 'ARB',
                icon: ARB,
                gebName: 'Arbitrum',
                balance: '0',
                address: '0x912ce59144191c1204e64559fe8253a0e49e6548',
            },
            {
                name: 'WETH',
                icon: WETH,
                gebName: 'Wrapped Ether',
                balance: '0',
                address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
            },
            {
                name: 'RETH',
                icon: RETH,
                gebName: 'Rocket Ether',
                balance: '0',
                address: '0xec70dcb4a1efa46b8f2d97c310c9c4790ba5ffa8',
            },
        ],
        chainId: 42161,
        chainName: 'Arbitrum',
        publicRPC: RPC_URL_ARBITRUM,
    },
    1: {
        tokens: [
            {
                name: 'ETH',
                icon: WETH,
                gebName: 'Ether',
                balance: '0',
                address: '0x0000000000000000000000000000000000000000',
                comingSoon: false,
            },
            {
                name: 'WSTETH',
                icon: WSTETH,
                gebName: 'Wrapped Staked Ether',
                balance: '0',
                address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
                comingSoon: false,
            },
            {
                name: 'RETH',
                icon: RETH,
                gebName: 'Rocket Ether',
                balance: '0',
                address: '0xae78736cd615f374d3085123a210448e74fc6393',
                comingSoon: false,
            },
            {
                name: 'ARB',
                icon: ARB,
                gebName: 'Arbitrum',
                balance: '0',
                address: '0xb50721bcf8d664c30412cfbc6cf7a15145234ad1',
                comingSoon: false,
            },
            {
                name: 'pufETH',
                icon: WETH,
                gebName: 'Puff ETH',
                balance: '0',
                address: '0xd9a442856c234a39a81a089c06451ebaa4306a72',
                comingSoon: true,
            },
        ],
        chainId: 1,
        chainName: 'Ethereum',
        publicRPC: RPC_URL_ETHEREUM,
    },
    10: {
        tokens: [
            {
                name: 'ETH',
                icon: WETH,
                gebName: 'Ether',
                balance: '0',
                address: '0x0000000000000000000000000000000000000000',
                comingSoon: false,
            },
            {
                name: 'WSTETH',
                icon: WSTETH,
                gebName: 'Wrapped Staked Ether',
                balance: '0',
                address: '0x1f32b1c2345538c0c6f582fcb022739c4a194ebb',
                comingSoon: false,
            },
            {
                name: 'RETH',
                icon: RETH,
                gebName: 'Rocket Ether',
                balance: '0',
                address: '0x9bcef72be871e61ed4fbbc7630889bee758eb81d',
                comingSoon: false,
            },
            {
                name: 'ARB',
                icon: ARB,
                gebName: 'Arbitrum',
                balance: '0',
                address: '',
                comingSoon: false,
            },
            {
                name: 'pufETH',
                icon: WETH,
                gebName: 'Puff ETH',
                balance: '0',
                address: '',
                comingSoon: true,
            },
        ],
        chainId: 10,
        chainName: 'Optimism',
        publicRPC: RPC_URL_OPTIMISM,
    },
    137: {
        tokens: [
            {
                name: 'WETH',
                icon: WETH,
                gebName: 'Wrapped Ether',
                balance: '0',
                address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
                comingSoon: false,
            },
            {
                name: 'WSTETH',
                icon: WSTETH,
                gebName: 'Wrapped Staked Ether',
                balance: '0',
                address: '0x03b54a6e9a984069379fae1a4fc4dbae93b3bccd',
                comingSoon: false,
            },
            {
                name: 'RETH',
                icon: RETH,
                gebName: 'Rocket Ether',
                balance: '0',
                address: '0x0266f4f08d82372cf0fcbccc0ff74309089c74d1',
                comingSoon: false,
            },
            {
                name: 'ARB',
                icon: ARB,
                gebName: 'Arbitrum',
                balance: '0',
                address: '',
                comingSoon: false,
            },
            {
                name: 'pufETH',
                icon: WETH,
                gebName: 'Puff ETH',
                balance: '0',
                address: '',
                comingSoon: true,
            },
        ],
        chainId: 137,
        chainName: 'Polygon',
        publicRPC: RPC_URL_POLYGON,
    },

    8453: {
        tokens: [
            {
                name: 'ETH',
                icon: WETH,
                gebName: 'Ether',
                balance: '0',
                address: '0x0000000000000000000000000000000000000000',
            },
            {
                name: 'WSTETH',
                icon: WSTETH,
                gebName: 'Wrapped Staked Ether',
                balance: '0',
                address: '0xc1cba3fcea344f92d9239c08c0568f6f2f0ee452',
            },
            {
                name: 'RETH',
                icon: RETH,
                gebName: 'Rocket Ether',
                balance: '0',
                address: '0xb6fe221fe9eef5aba221c348ba20a1bf5e73624c',
            },
            {
                name: 'ARB',
                icon: ARB,
                gebName: 'Arbitrum',
                balance: '0',
                address: '',
                comingSoon: false,
            },
            {
                name: 'pufETH',
                icon: WETH,
                gebName: 'Puff ETH',
                balance: '0',
                address: '',
                comingSoon: true,
            },
        ],
        chainId: 8453,
        chainName: 'Base',
        publicRPC: RPC_URL_BASE,
    },
}

export const gasTokenMapping: { [key: string | number]: string } = {
    Mainnet: '0x0000000000000000000000000000000000000000',
    Polygon: '0x0000000000000000000000000000000000001010',
    Optimism: '0x0000000000000000000000000000000000000000',
    Base: '0x0000000000000000000000000000000000000000',
    Arbitrum: '0x0000000000000000000000000000000000000000',
    1: '0x0000000000000000000000000000000000000000',
    137: '0x0000000000000000000000000000000000001010',
    10: '0x0000000000000000000000000000000000000000',
    42161: '0x0000000000000000000000000000000000000000',
    8453: '0x0000000000000000000000000000000000000000',
}

export const getGasToken = (chain: string | number): string => {
    return gasTokenMapping[chain]
}

export const checkUserGasBalance = async (userAddress: string, provider: Provider) => {
    const balance = await provider.getBalance(userAddress)
    return +ethers.utils.formatUnits(balance) > +'0'
}

export const checkUserHasBalance = async (
    tokenAddress: string,
    userAddress: string,
    provider: Provider,
    amount?: string
) => {
    const tokenContract = new ethers.Contract(
        tokenAddress,
        ['function balanceOf(address) view returns (uint256)'],
        provider
    )
    const balance = await tokenContract.balanceOf(userAddress)
    return +ethers.utils.formatUnits(balance) < +(amount || '0')
}

export const getUserBalance = async (tokens: any[], userAddress: string, rpcUrl: string) => {
    const user = ethers.utils.getAddress(userAddress)
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const balances = [] as any

    await Promise.all(
        tokens.map(async (token) => {
            if (gasTokenArray.includes(token.address)) {
                try {
                    const balance = await provider.getBalance(user)
                    balances.push({
                        ...token,
                        balance: ethers.utils.formatUnits(balance),
                    })
                } catch (e) {
                    console.log(e)
                    return
                }
            } else {
                try {
                    const tokenContract = new ethers.Contract(token.address, ERC20__factory.abi, provider)
                    const balance = await tokenContract.balanceOf(user)
                    balances.push({
                        ...token,
                        balance: ethers.utils.formatUnits(balance),
                    })
                } catch (e) {
                    console.log(e)
                    return
                }
            }
        })
    )

    return balances
}
