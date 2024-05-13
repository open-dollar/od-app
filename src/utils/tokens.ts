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
