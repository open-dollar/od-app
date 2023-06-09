import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useStoreActions, useStoreState } from '../store'
import { amountToFiat, returnWalletAddress } from '../utils/helper'
import Button from './Button'
import NavLinks from './NavLinks'
import { useTranslation } from 'react-i18next'
import { useWeb3React } from '@web3-react/core'
import ConnectedWalletIcon from './ConnectedWalletIcon'
import { CSSTransition } from 'react-transition-group'
import { COIN_TICKER } from '../utils/constants'

const SideMenu = () => {
    const { t } = useTranslation()
    const nodeRef = React.useRef(null)
    const { active, account, chainId } = useWeb3React()
    const [isOpen, setIsOpen] = useState(false)
    const { popupsModel: popupsActions } = useStoreActions((state) => state)
    const { connectWalletModel: connectWalletState, popupsModel: popupsState } =
        useStoreState((state) => state)

    const handleWalletConnect = () =>
        popupsActions.setIsConnectorsWalletOpen(true)

    const renderBalance = () => {
        if (chainId) {
            const balance = connectWalletState.ethBalance[chainId] || 0
            const fiat = connectWalletState.fiatPrice
            return amountToFiat(balance as number, fiat)
        }
        return 0
    }

    useEffect(() => {
        setIsOpen(popupsState.showSideMenu)
    }, [popupsState.showSideMenu])

    return isOpen ? (
        <CSSTransition
            in={isOpen}
            timeout={300}
            appear={isOpen}
            nodeRef={nodeRef}
            classNames="fade"
            unmountOnExit
            mountOnEnter
        >
            <Container ref={nodeRef}>
                <Inner>
                    <Overlay
                        onClick={() => popupsActions.setShowSideMenu(false)}
                    />

                    <InnerContainer>
                        <AccountBalance>
                            {active && account ? (
                                <Account
                                    onClick={() => {
                                        popupsActions.setIsConnectedWalletModalOpen(
                                            true
                                        )
                                        popupsActions.setShowSideMenu(false)
                                    }}
                                >
                                    <ConnectedWalletIcon size={40} />
                                    <AccountData>
                                        <Address>
                                            {returnWalletAddress(account)}
                                        </Address>
                                        <Balance>{`$ ${renderBalance()}`}</Balance>
                                    </AccountData>
                                </Account>
                            ) : (
                                <ConnectBtnContainer>
                                    <Icon
                                        src={
                                            require('../assets/LogoIcon.png')
                                                .default
                                        }
                                    />
                                    <Title>{t('welcome_reflexer')}</Title>
                                    <Text>
                                        {t('connect_text', {
                                            coin_ticker: COIN_TICKER,
                                        })}
                                    </Text>
                                    <Button
                                        onClick={handleWalletConnect}
                                        text={'connect_wallet'}
                                    />
                                </ConnectBtnContainer>
                            )}
                        </AccountBalance>
                        <NavLinks />
                    </InnerContainer>
                </Inner>
            </Container>
        </CSSTransition>
    ) : null
}

export default SideMenu

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 997;
    overflow-y: auto;

    &.fade-appear {
        opacity: 0;
    }
    &.fade-appear-active {
        opacity: 1;
        transition: all 300ms;
    }
`

const Inner = styled.div`
    position: relative;
`

const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100vh;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
`

const InnerContainer = styled.div`
    min-height: 100vh;
    width: calc(100% - 50px);
    background: ${(props) => props.theme.colors.background};
    padding-bottom: 1rem;
    position: relative;
    z-index: 2;
    margin-left: auto;
`

const ConnectBtnContainer = styled.div`
    text-align: center;
    width: 100%;
`

const AccountBalance = styled.div`
    padding: 30px 20px 20px 25px;
    margin-bottom: 15px;
`

const Balance = styled.div`
    color: ${(props) => props.theme.colors.primary};
    font-size: 16px;
    line-height: 27px;
    font-weight: 600;
    letter-spacing: -0.69px;
`

const AccountData = styled.div`
    margin-left: 10px;
`

const Address = styled.div`
    color: ${(props) => props.theme.colors.primary};
    font-size: 18px;
    line-height: 27px;
    font-weight: 600;
    letter-spacing: -0.69px;
`

const Account = styled.div`
    display: flex;
    justify-content: flex-start;
    cursor: pointer;
`

const Icon = styled.img`
    max-width: 60px;
`

const Title = styled.div`
    font-size: 22px;
    font-weight: 600;
`

const Text = styled.div`
    font-size: 14px;
    margin-top: 10px;
    margin-bottom: 10px;
`
