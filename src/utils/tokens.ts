export type TokenName =
    | 'eth'
    | 'rai'
    | 'flx'
    | 'stake'
    | 'unstake'
    | 'uniswapv2'
    | 'curve'
    | 'flx_lp'

export type Tokens = {
    [key in TokenName]: {
        name: string
        icon: string
        gebName: string
        balance: string
        address: string
    }
}
export const TOKENS: Tokens = {
    eth: {
        name: 'ETH',
        icon: require('../assets/eth-img.svg').default,
        gebName: '',
        balance: '',
        address: '',
    },
    rai: {
        name: 'RAI',
        icon: require('../assets/rai-logo.svg').default,
        gebName: 'coin',
        balance: '',
        address: '',
    },
    flx: {
        name: 'FLX',
        icon: require('../assets/flx-logo.svg').default,
        gebName: 'protocolToken',
        balance: '',
        address: '',
    },
    stake: {
        name: 'FLX/ETH',
        icon: require('../assets/flx_uni_eth.svg').default,
        gebName: 'stakingToken',
        balance: '',
        address: '',
    },
    unstake: {
        name: 'FLX/ETH',
        icon: require('../assets/stFLX.svg').default,
        gebName: 'stakingToken',
        balance: '',
        address: '',
    },
    uniswapv2: {
        name: 'RAI/ETH',
        icon: require('../assets/uniswap-icon.svg').default,
        gebName: 'uniswapPairCoinEth',
        balance: '',
        address: '',
    },
    curve: {
        name: 'RAI3CRV',
        icon: require('../assets/curve.svg').default,
        gebName: '',
        balance: '',
        address: '',
    },
    flx_lp: {
        name: 'FLX LP',
        icon: require('../assets/stFLX.svg').default,
        gebName: '',
        balance: '',
        address: '0x3a6FAA9b05c09252432EbffaAaE111e7bFa269a7',
    },
}
