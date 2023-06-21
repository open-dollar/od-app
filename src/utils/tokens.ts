export type Tokens = {
    [key: string]: {
        name: string
        icon: string
        gebName: string
        balance: string
        address: string
    }
}

export const TOKEN_LOGOS: {[key: string]: string} = {
    OP: require('../assets/op-img.svg').default,
    WETH: require('../assets/eth-img.svg').default,
    HAI: require('../assets/hai-logo.svg').default,
}