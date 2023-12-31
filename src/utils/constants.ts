import { ethers } from 'ethers'
import { Geb } from '@opendollar/sdk'
import { css } from 'styled-components'
import { injected, walletconnect, walletlink } from '../connectors'
import { SupportedChainId } from './chains'
import { ChainId, WalletInfo } from './interfaces'

type AddressMap = { [chainId: number]: string }

const { REACT_APP_SYSTEM_STATUS, REACT_APP_NETWORK_URL } = process.env

export const MULTICALL2_ADDRESSES: AddressMap = {
    [SupportedChainId.ARBITRUM_SEPOLIA]: '0xcA11bde05977b3631167028862bE2a173976CA11',
}

export enum Network {
    ARBITRUM = 'arbitrum',
    ARBITRUM_SEPOLIA = 'arbitrum-sepolia',
}

export const ETH_NETWORK = Network.ARBITRUM_SEPOLIA

export const COIN_TICKER = 'OD'

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000'
export const SYSTEM_STATUS = REACT_APP_SYSTEM_STATUS || ''

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
    INJECTED: {
        connector: injected,
        name: 'Injected',
        iconName: 'arrow-right.svg',
        description: 'Injected web3 provider.',
        href: null,
        color: '#010101',
        primary: true,
    },
    METAMASK: {
        connector: injected,
        name: 'MetaMask',
        iconName: 'metamask.png',
        description: 'Easy-to-use browser extension.',
        href: null,
        color: '#E8831D',
    },
    WALLET_CONNECT: {
        // @ts-ignore
        connector: walletconnect,
        name: 'WalletConnect',
        iconName: 'walletConnectIcon.svg',
        description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
        href: null,
        color: '#4196FC',
        mobile: true,
    },
    WALLET_LINK: {
        connector: walletlink,
        name: 'Coinbase Wallet',
        iconName: 'coinbaseWalletIcon.svg',
        description: 'Use Coinbase Wallet app on mobile device',
        href: null,
        color: '#315CF5',
    },
    COINBASE_LINK: {
        connector: walletlink,
        name: 'Open in Coinbase Wallet',
        iconName: 'coinbaseWalletIcon.svg',
        description: 'Open in Coinbase Wallet app.',
        href: 'https://go.cb-w.com/wJMtuYaNxfb',
        color: '#315CF5',
        mobile: true,
        mobileOnly: true,
    },
}

export const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
    42161: 'Arbitrum One',
    421614: 'Arbitrum Sepolia.',
}

const MEDIA_WIDTHS = {
    upToExtraSmall: 576,
    upToSmall: 768,
    upToMedium: 992,
    upToLarge: 1280,
}

export const mediaWidthTemplates: {
    [width in keyof typeof MEDIA_WIDTHS]: typeof css
} = Object.keys(MEDIA_WIDTHS).reduce((accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
        @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
            ${css(a, b, c)}
        }
    `
    return accumulator
}, {}) as any

export const DEFAULT_SAFE_STATE = {
    totalCollateral: '',
    totalDebt: '',
    leftInput: '',
    rightInput: '',
    collateralRatio: 0,
    liquidationPrice: 0,
    collateral: '',
}

export const floatsTypes = {
    WAD: 18,
    RAY: 27,
    RAD: 45,
}

export const jdenticonConfig = {
    hues: [103],
    lightness: {
        color: [0.84, 0.84],
        grayscale: [0.84, 0.84],
    },
    saturation: {
        color: 0.48,
        grayscale: 0.48,
    },
    backColor: '#50ccd5',
}

export const INITIAL_INCENTIVE_STATE = [
    {
        campaignNumber: '',
        periodFinish: '',
        campaignAddress: '',
        rewardRate: '',
        totalSupply: '',
        coinAddress: '',
        wethAddress: '',
        coinTotalSupply: '',
        stakedBalance: '',
        campaignEndTime: '',
        dailyFLX: 0,
        uniSwapLink: '',
        ethStake: '',
        haiStake: '',
        myRewardRate: '',
        reserveOD: '',
        reserveETH: '',
        token0: '',
        token0Price: '',
        token1Price: '',
        lastUpdatedTime: '',
        rewardPerTokenStored: '',
        isOngoingCampaign: false,
        isCoinLessThanWeth: true,
        user: '' || null,
        IB_reward: '',
        IB_userRewardPerTokenPaid: '',
    },
]

const INIT_VALUES = {
    name: 'FLX',
    img: require('../assets/logo192.png').default,
    amount: 0,
    price: 0,
    diff: 0,
    value: 0,
    diffPercentage: 0,
}

export const INITIAL_INCENTIVE_ASSETS_STATE = {
    eth: INIT_VALUES,
    hai: INIT_VALUES,
    flx: INIT_VALUES,
}

export const network_name = process.env.REACT_APP_NETWORK_ID === '42161' ? 'arbitrum' : 'arbitrum-sepolia'

const provider = new ethers.providers.JsonRpcProvider(REACT_APP_NETWORK_URL)
export const geb = new Geb(network_name, provider)
