export type Tokens = {
    [key: string]: {
        name: string
        icon: string
        gebName: string
        balance: string
        address: string
    }
}
export const TOKENS: Tokens = {
    OP: {
        name: 'OP',
        icon: require('../assets/op-img.svg').default,
        gebName: '',
        balance: '0',
        address: '0x4200000000000000000000000000000000000042',
    },
    WETH: {
        name: 'WETH',
        icon: require('../assets/eth-img.svg').default,
        gebName: '',
        balance: '0',
        address: '0x4200000000000000000000000000000000000006',
    },
    HAI: {
        name: 'HAI',
        icon: require('../assets/hai-logo.svg').default,
        gebName: 'coin',
        balance: '0',
        address: '0xEaE90F3b07fBE00921173298FF04f416398f7101',
    },
}
