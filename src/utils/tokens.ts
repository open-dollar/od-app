import WETH from '../assets/eth-img.svg'
import OP from '../assets/op-img.svg'
import OD from '../assets/od-logo.svg'
import ODG from '../assets/odg.svg'
import WSTETH from '../assets/wsteth.svg'
import CBETH from '../assets/cbETH.svg'
import RETH from '../assets/rETH.svg'
import ARB from '../assets/arb.svg'
import MAGIC from '../assets/magic.svg'
import PUFETH from '../assets/pufeth.svg'
import { Provider } from '@ethersproject/providers'
import { ethers } from 'ethers'

export type Tokens = {
    [key: string]: {
        name: string
        icon: string
        gebName: string
        balance: string
        address: string
    }
}

export const TOKEN_LOGOS: { [key: string]: string } = {
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
}

export function getTokenLogo(token: string): string {
    return TOKEN_LOGOS[token] || require('../assets/stETH.svg').default
}

export const bridgeTokens: any = {
    1: {
        tokens: [
            {
                name: 'WETH',
                icon: WETH,
                gebName: 'Wrapped Ether',
                balance: '0',
                address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            },
            {
                name: 'WSTETH',
                icon: WSTETH,
                gebName: 'Wrapped Staked Ether',
                balance: '0',
                address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
            },
            {
                name: 'rETH',
                icon: RETH,
                gebName: 'Rocket Ether',
                balance: '0',
                address: '0xae78736cd615f374d3085123a210448e74fc6393',
            },
            {
                name: 'ARB',
                icon: ARB,
                gebName: 'Arbitrum',
                balance: '0',
                address: '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1'
            },
            {
                name: 'ETH',
                icon: WETH,
                gebName: 'Ether',
                balance: '0',
                address: '0x0000000000000000000000000000000000000000',
            }
        ],
        chainId: 1,
        publicRPC: 'https://eth-pokt.nodies.app'
    },
    10: {
        tokens: [
            {
                name: 'WETH',
                icon: WETH,
                gebName: 'Wrapped Ether',
                balance: '0',
                address: '0x4200000000000000000000000000000000000006'
            },
            {
                name: 'ETH',
                icon: WSTETH,
                gebName: 'Ether',
                balance: '0',
                address: '0x4200000000000000000000000000000000000042'
            },
            {
                name: 'WSTETH',
                icon: WSTETH,
                gebName: 'Wrapped Staked Ether',
                balance: '0',
                address: '0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb'
            },
            {
                name: 'RETH',
                icon: RETH,
                gebName: 'Rocket Ether',
                balance: '0',
                address: '0x9Bcef72be871e61ED4fBbc7630889beE758eb81D'
            },
        ],
        chainId: 10,
        publicRPC: 'https://eth-pokt.nodies.app'
    },
    137: {
        tokens: [
            {
                name: 'WETH',
                icon: WETH,
                gebName: 'Wrapped Ether',
                balance: '0',
                address: '0x420'
            },
        ],
        chainId: 137,
        publicRPC: 'https://polygon-pokt.nodies.app',
    },
    42161: {
        tokens: [
            {
                name: 'WETH',
                icon: WETH,
                gebName: 'Wrapped Ether',
                balance: '0',
                address: '0x420'
            },
        ],
        chainId: 42161,
        publicRPC: 'https://arbitrum-pokt.nodies.app',
    },
    8453: {
        tokens: [
            {
                name: 'WETH',
                icon: WETH,
                gebName: 'Wrapped Ether',
                balance: '0',
                address: '0x420'
            },
        ],
        chainId: 8453,
        publicRPC: 'https://base-pokt.nodies.app',
    }
}
export const gasTokenMapping: { [key: string | number]: string } = {
    Mainnet: '0x0000000000000000000000000000000000000000',
    Polygon: '0x0000000000000000000000000000000000001010',
    Optimism: '0x4200000000000000000000000000000000000042',
    Base: '0x0000000000000000000000000000000000000000',
    Arbitrum: '0x0000000000000000000000000000000000000000',
    1: '0x0000000000000000000000000000000000000000',
    137: '0x0000000000000000000000000000000000001010',
    10: '0x4200000000000000000000000000000000000042',
    42161: '0x0000000000000000000000000000000000000000',
    8453: '0x0000000000000000000000000000000000000000'
}

export const getGasToken = (chain: string | number): string => {
    return gasTokenMapping[chain]
}

export const checkUserGasBalance = async (userAddress: string, provider: Provider) => {
    const balance = await provider.getBalance(userAddress)
    return +ethers.utils.formatUnits(balance) === +'0'
}

export const checkUserBalance = async (
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
    return +ethers.utils.formatUnits(balance) <= +(amount || '0')
}
