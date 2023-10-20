import React, { useEffect, useMemo, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'

import { amountToFiat, returnWalletAddress, getTokenLogo, formatDataNumber, formatNumber } from '~/utils'
import { useStoreActions, useStoreState } from '~/store'
import ConnectedWalletIcon from './ConnectedWalletIcon'
import NavLinks from './NavLinks'
import Button from './Button'

import ArrowDown from '~/components/Icons/ArrowDown'
import Camelot from '~/components/Icons/Camelot'
import { fetchPoolData } from '@opendollar/sdk'
import { fetchAnalyticsData } from '@opendollar/sdk/lib/virtual/virtualAnalyticsData'
import useGeb from '~/hooks/useGeb'

const SideMenu = () => {
    const nodeRef = React.useRef(null)
    const [isPopupVisible, setPopupVisibility] = useState(false)
    const [isTokenPopupVisible, setTokenPopupVisibility] = useState(false)
    const [isTestTokenPopupVisible, setTestTokenPopupVisibility] = useState(false)
    const [state, setState] = useState({
        odPrice: '',
        totalLiquidity: '',
    })
    const popupRef = useRef<HTMLDivElement | null>(null)
    const { isActive, account, chainId } = useWeb3React()
    const dollarRef = useRef<HTMLButtonElement | null>(null)
    const geb = useGeb()
    const odRef = useRef<HTMLButtonElement | null>(null)
    const testTokenPopupRef = useRef<HTMLDivElement | null>(null)
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

    const handleClickOutsideOdRef = (event: MouseEvent) => {
        if (
            dollarRef.current &&
            !dollarRef.current.contains(event.target as Node) &&
            popupRef.current &&
            !popupRef.current.contains(event.target as Node)
        ) {
            setPopupVisibility(false)
        }
    }

    const handleClickOutsideTestToken = (event: MouseEvent) => {
        if (testTokenPopupRef.current && !testTokenPopupRef.current.contains(event.target as Node)) {
            setTestTokenPopupVisibility(false)
        }
    }

    const handleClickOutsideOdWallet = (event: MouseEvent) => {
        if (odRef.current && !odRef.current.contains(event.target as Node)) {
            setTokenPopupVisibility(false)
        }
    }

    const odBalance = useMemo(() => {
        const balances = connectWalletModel.tokensFetchedData
        return formatDataNumber(balances.OD ? balances.OD.balanceE18.toString() : '0', 18, 2, false)
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
        async function fetchData() {
            if (geb) {
                try {
                    const [poolData, analyticsData] = await Promise.all([fetchPoolData(geb), fetchAnalyticsData(geb)])

                    const formattedLiquidity = formatNumber(poolData?.totalLiquidityUSD, 6, false).toString()

                    setState((prevState) => ({
                        ...prevState,
                        odPrice: formatDataNumber(analyticsData.marketPrice, 18, 3, true, undefined, 2),
                        totalLiquidity: formattedLiquidity,
                    }))
                } catch (error) {
                    console.error('Error fetching data:', error)
                }
            }
        }

        fetchData()
        document.addEventListener('mousedown', handleClickOutsideOdRef)
        document.addEventListener('mousedown', handleClickOutsideTestToken)
        document.addEventListener('mousedown', handleClickOutsideOdWallet)

        return () => {
            // Cleanup the event listener on component unmount
            document.removeEventListener('mousedown', handleClickOutsideOdRef)
            document.removeEventListener('mousedown', handleClickOutsideTestToken)
            document.removeEventListener('mousedown', handleClickOutsideOdWallet)
        }
    }, [geb])

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
                                    {odBalance + ' '} OD
                                    <ArrowWrapper>
                                        <ArrowDown fill={isTokenPopupVisible ? '#1499DA' : '#00587E'} />
                                    </ArrowWrapper>
                                </DollarValue>
                                {isTokenPopupVisible && (
                                    <PriceInfoPopup className="group">
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
                                    <span>{state.odPrice}</span>
                                    <ArrowWrapper>
                                        <ArrowDown fill={isPopupVisible ? '#1499DA' : '#00587E'} />
                                    </ArrowWrapper>
                                </DollarValue>
                                {isPopupVisible && (
                                    <LiquidityPriceInfoPopup ref={popupRef} className="group">
                                        <PopupWrapperLink className="group">
                                            <IconWrapper>
                                                <Camelot />
                                            </IconWrapper>
                                            <PopupColumn>
                                                <div>Liquidity: ${state.totalLiquidity}</div>
                                                <CamelotText>View on Camelot Exchange</CamelotText>
                                            </PopupColumn>
                                        </PopupWrapperLink>
                                    </LiquidityPriceInfoPopup>
                                )}
                            </Price>
                            <Price ref={testTokenPopupRef}>
                                <ClaimButton onClick={() => setTestTokenPopupVisibility(!isTestTokenPopupVisible)}>
                                    Test tokens 🪂
                                    <ArrowWrapper>
                                        <ArrowDown fill={isTestTokenPopupVisible ? '#1499DA' : '#00587E'} />
                                    </ArrowWrapper>
                                </ClaimButton>
                                {isTestTokenPopupVisible && (
                                    <TestTokenPopup className="group">
                                        <TestTokenTextWrapper>
                                            USE THE /CLAIM COMMAND IN OUR{' '}
                                            <a target="blank" href="https://discord.opendollar.com/">
                                                DISCORD
                                            </a>
                                        </TestTokenTextWrapper>
                                    </TestTokenPopup>
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

const CamelotText = styled.div`
    font-size: xx-small;
    font-weight: 400;
    color: #ffaf1d;
`

const TestTokenTextWrapper = styled.div`
    font-size: ${(props) => props.theme.font.extraSmall};
    text-align: left;
    font-weight: 600;
    color: #0079ad;
    word-wrap: break-word;
    max-width: 100%;
`
const TestTokenPopup = styled.div`
    position: absolute;
    max-width: 150px;
    padding: 8px;
    background: ${(props) => props.theme.colors.colorPrimary};
    border-radius: 8px;
    top: 45px;
`

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
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    flex-direction: column;
    padding: 30px 25px;
    margin-top: 48px;
    display: flex;
    gap: 16px;
    @media (max-width: 767px) {
        margin-top: 16px;
        position: unset;
        transform: initial;
    }
`

const PopupColumn = styled.div``

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

const LiquidityPriceInfoPopup = styled.div`
    position: absolute;
    z-index: 500;
    min-width: 190px;
    padding: 8px;
    background: ${(props) => props.theme.colors.colorPrimary};
    border-radius: 8px;
    top: 45px;
`

const PriceInfoPopup = styled.div`
    position: absolute;
    z-index: 500;
    min-width: 160px;
    padding: 8px;
    background: ${(props) => props.theme.colors.colorPrimary};
    border-radius: 8px;
    top: 45px;
`

const ArrowWrapper = styled.div`
    margin-left: 8px;
`

const Icon = styled.img`
    margin-right: 10px;
    max-width: 23px;
`

const OdButton = styled.button`
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
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    &:hover {
        opacity: 0.8;
    }
`

const ClaimButton = styled(OdButton)``

const DollarValue = styled(OdButton)`
    width: auto;
    white-space: nowrap;
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
    justify-content: center;
    cursor: pointer;
    @media (max-width: 767px) {
        justify-content: flex-start;
    }
`
