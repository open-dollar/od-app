import React from 'react'

const INITIAL_STATE = [
    require('../assets/brand-white.svg').default,
    require('../assets/dark-arrow.svg').default,
    require('../assets/connectors/walletConnectIcon.svg').default,
    require('../assets/connectors/coinbaseWalletIcon.svg').default,
    require('../assets/cookie.svg').default,
    require('../assets/caret.png').default,
    require('../assets/caret-up.svg').default,
    require('../assets/arrow-up.svg').default,
    require('../assets/LogoIcon.png').default,
    require('../assets/arrow.svg').default,
    require('../assets/uniswap-icon.svg').default,
    require('../assets/logo192.png').default,
    require('../assets/connectors/metamask.png').default,
    require('../assets/saviour.svg').default,
    require('../assets/account-img.png').default,
    require('../assets/wallet-img.png').default,
    require('../assets/safe-img.png').default,
]

const ImagePreloader = () => {
    return (
        <div style={{ display: 'none' }}>
            {INITIAL_STATE.map((img: string, i: number) => (
                <img src={img} alt="" key={img + i} />
            ))}
        </div>
    )
}

export default ImagePreloader
