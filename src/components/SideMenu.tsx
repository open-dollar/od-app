import React, { useEffect, useMemo, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { amountToFiat, returnWalletAddress, COIN_TICKER, getTokenLogo, formatNumber } from '~/utils'
import { useStoreActions, useStoreState } from '~/store'
import ConnectedWalletIcon from './ConnectedWalletIcon'
import NavLinks from './NavLinks'
import Button from './Button'

import { utils } from 'ethers'
import LoadingDots from '~/components/Icons/LoadingDots'
import ArrowDown from '~/components/Icons/ArrowDown'
import Uniswap from '~/components/Icons/Uniswap'

const SideMenu = () => {
    const { t } = useTranslation()
    const nodeRef = React.useRef(null)
    const [isPopupVisible, setPopupVisibility] = useState(false)
    const [isTokenPopupVisible, setTokenPopupVisibility] = useState(false)
    const [loadingOdValue, setLoadingOdValue] = useState(false)
    const popupRef = useRef<HTMLDivElement | null>(null)
    const { isActive, account, chainId } = useWeb3React()
    const dollarRef = useRef<HTMLButtonElement | null>(null)
    const odRef = useRef<HTMLButtonElement | null>(null)
    const tokenPopupRef = useRef<HTMLDivElement | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const { popupsModel: popupsActions } = useStoreActions((state) => state)
    const {
        connectWalletModel,
        connectWalletModel: connectWalletState,
        popupsModel: popupsState,
    } = useStoreState((state) => state)

    const handleWalletConnect = () => popupsActions.setIsConnectorsWalletOpen(true)

    const handleDollarClick = () => {
        setPopupVisibility(!isPopupVisible)
    }

    const handleTokenClick = () => {
        setTokenPopupVisibility(!isTokenPopupVisible)
    }

    const haiBalance = useMemo(() => {
        const balances = connectWalletModel.tokensFetchedData
        return formatNumber(balances.OD ? utils.formatEther(balances.OD.balanceE18) : '0', 2)
    }, [connectWalletModel.tokensFetchedData])

    const renderBalance = () => {
        if (chainId) {
            const balance = connectWalletState.ethBalance[chainId] || 0
            const fiat = connectWalletState.fiatPrice
            return amountToFiat(balance as number, fiat)
        }
        return 0
    }

    const handleAddOD = async () => {
        try {
            const { ethereum } = window
            // @ts-ignore
            await ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    // @ts-ignore
                    type: 'ERC20',
                    options: {
                        address: connectWalletModel.tokensData.OD.address,
                        symbol: connectWalletModel.tokensData.OD.symbol,
                        decimals: connectWalletModel.tokensData.OD.decimals,
                    },
                },
            })
        } catch (error) {
            console.log('Error adding OD to the wallet:', error)
        }
    }

    const handleAddODG = async () => {
        try {
            const { ethereum } = window
            // @ts-ignore
            await ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    // @ts-ignore
                    type: 'ERC20',
                    options: {
                        address: connectWalletModel.tokensData.ODG.address,
                        symbol: connectWalletModel.tokensData.ODG.symbol,
                        decimals: connectWalletModel.tokensData.ODG.decimals,
                    },
                },
            })
        } catch (error) {
            console.log('Error adding ODG to the wallet:', error)
        }
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
                    <Overlay onClick={() => popupsActions.setShowSideMenu(false)} />
                    <InnerContainer>
                        <CloseButtonContainer onClick={() => popupsActions.setShowSideMenu(false)}>
                            <img
                                src={require('../assets/close-icon.svg').default}
                                height={'24px'}
                                width={'24px'}
                                alt="X"
                            />
                        </CloseButtonContainer>
                        <AccountBalance>
                            {isActive && account ? (
                                <Account
                                    onClick={() => {
                                        popupsActions.setIsConnectedWalletModalOpen(true)
                                        popupsActions.setShowSideMenu(false)
                                    }}
                                >
                                    <ConnectedWalletIcon size={40} />
                                    <AccountData>
                                        <Address>{returnWalletAddress(account)}</Address>
                                        <Balance>{`$ ${renderBalance()}`}</Balance>
                                    </AccountData>
                                </Account>
                            ) : (
                                <ConnectBtnContainer>
                                    <Button onClick={handleWalletConnect} text={'connect_wallet'} />
                                </ConnectBtnContainer>
                            )}
                        </AccountBalance>
                        <NavLinks />
                        <OpenDollarInformationColumn>
                            <Price>
                                <DollarValue ref={odRef} onClick={handleTokenClick}>
                                    <Icon
                                        src={require('../assets/od-wallet-icon.svg').default}
                                        width={'16px'}
                                        height={'16px'}
                                    />
                                    {haiBalance + ' '} OD
                                    <ArrowWrapper>
                                        <ArrowDown fill={isTokenPopupVisible ? '#1499DA' : '#00587E'} />
                                    </ArrowWrapper>
                                </DollarValue>
                                {isTokenPopupVisible && (
                                    <PriceInfoPopup ref={tokenPopupRef} className="group">
                                        <TokenTextWrapper>ADD TOKEN TO WALLET</TokenTextWrapper>
                                        <PopupColumnWrapper>
                                            <PopupWrapperTokenLink onClick={() => handleAddOD()} className="group">
                                                <IconWrapper>
                                                    <img
                                                        src={require('../assets/od-logo.svg').default}
                                                        height={'24px'}
                                                        width={'24px'}
                                                        alt="X"
                                                    />
                                                </IconWrapper>
                                                <PopupColumn>
                                                    <div>OD</div>
                                                </PopupColumn>
                                            </PopupWrapperTokenLink>
                                            <PopupWrapperTokenLink onClick={() => handleAddODG()} className="group">
                                                <IconWrapper>
                                                    <img
                                                        src={require('../assets/odg.svg').default}
                                                        height={'24px'}
                                                        width={'24px'}
                                                        alt="X"
                                                    />
                                                </IconWrapper>
                                                <PopupColumn>
                                                    <div>ODG</div>
                                                </PopupColumn>
                                            </PopupWrapperTokenLink>
                                        </PopupColumnWrapper>
                                    </PriceInfoPopup>
                                )}
                            </Price>
                            <Price>
                                <DollarValue ref={dollarRef} onClick={handleDollarClick}>
                                    <Icon src={getTokenLogo('OD')} width={'16px'} height={'16px'} />
                                    {loadingOdValue ? <LoadingDots /> : <span>$1.001</span>}
                                    <ArrowWrapper>
                                        <ArrowDown fill={isPopupVisible ? '#1499DA' : '#00587E'} />
                                    </ArrowWrapper>
                                </DollarValue>
                                {isPopupVisible && (
                                    <PriceInfoPopup ref={popupRef} className="group">
                                        <PopupWrapperLink className="group">
                                            <IconWrapper>
                                                <Uniswap />
                                            </IconWrapper>
                                            <PopupColumn>
                                                <div>Liquidity: $3.53M</div>
                                                <div>Delta B: +735.14</div>
                                            </PopupColumn>
                                        </PopupWrapperLink>
                                    </PriceInfoPopup>
                                )}
                            </Price>
                        </OpenDollarInformationColumn>
                    </InnerContainer>
                </Inner>
            </Container>
        </CSSTransition>
    ) : null
}

export default SideMenu

const PopupColumnWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const TokenTextWrapper = styled.div`
    font-size: ${(props) => props.theme.font.extraSmall};
    text-align: left;
    font-weight: 600;
    color: #0079ad;
    margin-bottom: 8px;
`

const OpenDollarInformationColumn = styled.div`
    flex-direction: column;
    padding: 15px 25px;
    margin-top: 16px;
    display: flex;
    justify-content: left;
    gap: 16px;
`

const PopupColumn = styled.div`
    text-align: end;
`

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
`

const PopupWrapperTokenLink = styled.a`
    display: flex;
    gap: 8px;
    font-size: ${(props) => props.theme.font.small};
    font-weight: 600;
    color: ${(props) => props.theme.colors.neutral};
    cursor: pointer;
`

const PopupWrapperLink = styled.a`
    display: flex;
    gap: 8px;
    font-size: ${(props) => props.theme.font.small};
    font-weight: 600;
    color: ${(props) => props.theme.colors.neutral};
`

const Price = styled.div`
    position: relative;
    margin-right: auto;
`

const PriceInfoPopup = styled.div`
    position: absolute;
    z-index: 500;
    min-width: 180px;
    padding: 8px;
    background: ${(props) => props.theme.colors.colorPrimary};
    border-radius: 8px;
    top: 56px;
`

const ArrowWrapper = styled.div`
    margin-left: 8px;
`

const Icon = styled.img`
    margin-right: 10px;
    max-width: 23px;
`

const AddIcon = styled(Icon)`
    margin: 0 5px 0 10px;
`

const OdButton = styled.button`
    width: 163.45px;
    outline: none;
    cursor: pointer;
    border: none;
    box-shadow: none;
    padding: 8px 12px 8px 12px;
    line-height: 24px;
    font-size: ${(props) => props.theme.font.small};
    font-weight: 600;
    color: ${(props) => props.theme.colors.neutral};
    background: ${(props) => props.theme.colors.colorPrimary};
    border-radius: 50px;
    transition: all 0.3s ease;
    margin-right: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    &:hover {
        opacity: 0.8;
    }
`

const DollarValue = styled(OdButton)`
    width: 163.45px;
    justify-content: space-between;
`

// close button container should be button on right side of screen
const CloseButtonContainer = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    padding: 30px;
    cursor: pointer;
    font-size: 20px;
    font-weight: 600;
`

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
    text-align: left;
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

const Title = styled.div`
    font-size: 22px;
    font-weight: 600;
`

const Text = styled.div`
    font-size: 14px;
    margin-top: 10px;
    margin-bottom: 10px;
`
