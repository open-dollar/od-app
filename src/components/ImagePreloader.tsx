const INITIAL_STATE = [
    require('../assets/od-full-logo-dark.svg').default,
    require('../assets/od-full-logo-light.svg').default,
    require('../assets/dark-arrow.svg').default,
    require('../assets/connectors/walletConnectIcon.svg').default,
    require('../assets/connectors/coinbaseWalletIcon.svg').default,
    require('../assets/cookie.svg').default,
    require('../assets/caret.png').default,
    require('../assets/caret-up.svg').default,
    require('../assets/arrow-up.svg').default,
    require('../assets/od-logo.svg').default,
    require('../assets/arrow.svg').default,
    require('../assets/uniswap-icon.svg').default,
    require('../assets/logo192.png').default,
    require('../assets/connectors/metamask.png').default,
    require('../assets/od-land.png').default,
    require('../assets/od-colorloop.png').default,
    require('../assets/od-vault.png').default,
]

const ImagePreloader = () => {
    return (
        <div style={{ display: 'none' }}>
            {INITIAL_STATE.map((img: string, i: number) => (
                <img src={img} alt="" key={img + i.toString()} />
            ))}
        </div>
    )
}

export default ImagePreloader
