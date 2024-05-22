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
import { ERC20__factory } from '@opendollar/sdk/lib/typechained'

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

const gasTokenArray = [
    '0x0000000000000000000000000000000000000000',
    '0x4200000000000000000000000000000000000042',
    '0x0000000000000000000000000000000000001010',
]

export const bridgeTokens: any = {
    1: {
        tokens: [
            {
                name: 'WETH',
                icon: WETH,
                gebName: 'Wrapped Ether',
                balance: '0',
                address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
                comingSoon: false
            },
            {
                name: 'WSTETH',
                icon: WSTETH,
                gebName: 'Wrapped Staked Ether',
                balance: '0',
                address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
                comingSoon: false
            },
            {
                name: 'rETH',
                icon: RETH,
                gebName: 'Rocket Ether',
                balance: '0',
                address: '0xae78736cd615f374d3085123a210448e74fc6393',
                comingSoon: false
            },
            {
                name: 'ARB',
                icon: ARB,
                gebName: 'Arbitrum',
                balance: '0',
                address: '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1',
                comingSoon: false
            },
            {
                name: 'ETH',
                icon: WETH,
                gebName: 'Ether',
                balance: '0',
                address: '0x0000000000000000000000000000000000000000',
                comingSoon: false
            },
            {
                name: 'pufETH',
                icon: WETH,
                gebName: 'Puff ETH',
                balance: '0',
                address: '0xD9A442856C234a39a81a089C06451EBAa4306a72',
                comingSoon: true
            },
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
                address: '0x4200000000000000000000000000000000000006',
                comingSoon: false
            },
            {
                name: 'ETH',
                icon: WSTETH,
                gebName: 'Ether',
                balance: '0',
                address: '0x4200000000000000000000000000000000000042',
                comingSoon: false
            },
            {
                name: 'WSTETH',
                icon: WSTETH,
                gebName: 'Wrapped Staked Ether',
                balance: '0',
                address: '0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb',
                comingSoon: false
            },
            {
                name: 'RETH',
                icon: RETH,
                gebName: 'Rocket Ether',
                balance: '0',
                address: '0x9Bcef72be871e61ED4fBbc7630889beE758eb81D',
                comingSoon: false
            },
        ],
        chainId: 10,
        publicRPC: 'https://op-pokt.nodies.app'
    },
    137: {
        tokens: [
            {
                name: 'WETH',
                icon: WETH,
                gebName: 'Wrapped Ether',
                balance: '0',
                address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
                comingSoon: false
            },
            {
                name: 'WSTETH',
                icon: WSTETH,
                gebName: 'Wrapped Staked Ether',
                balance: '0',
                address: '0x03b54A6e9a984069379fae1a4fC4dBAE93B3bCCD',
                comingSoon: false
            },
            {
                name: 'RETH',
                icon: RETH,
                gebName: 'Rocket Ether',
                balance: '0',
                address: '0x0266F4F08D82372CF0FcbCCc0Ff74309089c74d1',
                comingSoon: false
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
                address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
            },
            {
                name: 'ETH',
                icon: WETH,
                gebName: 'Ether',
                balance: '0',
                address: '0x0000000000000000000000000000000000000000'
            },
            {
                name: 'WSTETH',
                icon: WSTETH,
                gebName: 'Wrapped Staked Ether',
                balance: '0',
                address: '0x5979D7b546E38E414F7E9822514be443A4800529'
            },
            {
                name: 'RETH',
                icon: RETH,
                gebName: 'Rocket Ether',
                balance: '0',
                address: '0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8'
            },

        ],
        chainId: 42161,
        publicRPC: 'https://arb-pokt.nodies.app',
    },
    8453: {
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
                icon: WETH,
                gebName: 'Ether',
                balance: '0',
                address: '0x0000000000000000000000000000000000000000'
            },
            {
                name: 'WSTETH',
                icon: WSTETH,
                gebName: 'Wrapped Staked Ether',
                balance: '0',
                address: '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452'
            },
            {
                name: 'RETH',
                icon: RETH,
                gebName: 'Rocket Ether',
                balance: '0',
                address: '0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c'
            },
        ],
        chainId: 8453,
        publicRPC: 'https://base.drpc.org',
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
    return +ethers.utils.formatUnits(balance) <= +(amount || '0')
}

export const getUserBalance = async (chainId: number, tokens: any[], userAddress: string, rpcUrl: string) => {
    const user = ethers.utils.getAddress(userAddress)
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    for await (const token of tokens) {
        if (gasTokenArray.includes(token.address)) {
            const balance = await provider.getBalance(user)
            const bridgeToken = bridgeTokens[chainId].tokens.filter((bridgeToken: any) => bridgeToken.address === token.address)
            bridgeToken.balance === ethers.utils.formatUnits(balance)
        } else {
            const tokenContract = new ethers.Contract(
                token.address,
                ERC20__factory.abi,
                provider
            )
            console.log(tokenContract)
            const balance = await tokenContract.balanceOf(user)
            const bridgeToken = bridgeTokens[chainId].tokens.filter((bridgeToken: any) => bridgeToken.address === token.address)
            bridgeToken.balance === ethers.utils.formatUnits(balance)
        }
    }
  
    return bridgeTokens[chainId]
}