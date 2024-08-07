import React, { useEffect, useMemo, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'

import { amountToFiat, formatDataNumber, ETH_NETWORK } from '~/utils'
import { useStoreActions, useStoreState } from '~/store'
import ConnectedWalletIcon from './ConnectedWalletIcon'
import NavLinks from './NavLinks'
import Button from './Button'

import ArrowDown from '~/components/Icons/ArrowDown'
import Camelot from '~/components/Icons/Camelot'
import useGeb from '~/hooks/useGeb'
import { BigNumber, ethers } from 'ethers'
import { X } from 'react-feather'
import useAnalyticsData from '~/hooks/useAnalyticsData'
import usePoolData from '~/hooks/usePoolData'
import TokenIcon from './TokenIcon'
import WalletIcon from '~/assets/wallet-icon.svg'
import DollarValueInner from './DollarValueInner'
import parachuteIcon from '../assets/parachute-icon.svg'
import { useAddress } from '~/hooks/useAddress'
import Skeleton from 'react-loading-skeleton'
import { GnosisSafe } from '@web3-react/gnosis-safe'

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
    const priceRef = useRef<HTMLDivElement | null>(null)
    const { isActive, account, chainId, connector } = useWeb3React()
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
    const poolData = usePoolData()
    const analyticsData = useAnalyticsData()
    let address = useAddress(account)

    const handleWalletConnect = () => {
        if (isActive && account) {
            popupsActions.setIsConnectedWalletModalOpen(true)
        }
        if (!(connector instanceof GnosisSafe)) {
            return popupsActions.setIsConnectorsWalletOpen(true)
        }
    }

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

    const handleClickOutsidePrice = (event: MouseEvent) => {
        if (priceRef.current && !priceRef.current.contains(event.target as Node)) {
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
        if (chainId !== 421614 && chainId !== 42161 && chainId !== 10) return
        if (poolData && analyticsData) {
            const formattedLiquidity = formatDataNumber(
                ethers.utils
                    .parseEther(
                        BigNumber.from(
                            Math.floor(Number(poolData?.totalLiquidityUSD ? poolData.totalLiquidityUSD : '0'))
                        ).toString()
                    )
                    .toString(),
                18,
                0,
                true
            ).toString()

            setState({
                odPrice: formatDataNumber(
                    analyticsData?.marketPrice ? analyticsData.marketPrice : '0',
                    18,
                    3,
                    true,
                    undefined,
                    2
                ),
                totalLiquidity: formattedLiquidity,
            })
        }

        document.addEventListener('mousedown', handleClickOutsideOdRef)
        document.addEventListener('mousedown', handleClickOutsideTestToken)
        document.addEventListener('mousedown', handleClickOutsidePrice)

        return () => {
            // Cleanup the event listener on component unmount
            document.removeEventListener('mousedown', handleClickOutsideOdRef)
            document.removeEventListener('mousedown', handleClickOutsideTestToken)
            document.removeEventListener('mousedown', handleClickOutsidePrice)
        }
    }, [geb, chainId, analyticsData, poolData])

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
                            <X size="24" color="#1A74EC" />
                        </CloseButtonContainer>

                        {isActive && account && (
                            <AccountBalance>
                                <Account
                                    onClick={() => {
                                        popupsActions.setIsConnectedWalletModalOpen(true)
                                        popupsActions.setShowSideMenu(false)
                                    }}
                                >
                                    <ConnectedWalletIcon size={40} />
                                    <AccountData>
                                        <Address>{address || <Skeleton width={115} />}</Address>
                                        <Balance>{`$ ${renderBalance()}`}</Balance>
                                    </AccountData>
                                </Account>
                            </AccountBalance>
                        )}
                        <OpenDollarInformationColumn>
                            <Price>
                                {account && (
                                    <DollarValue ref={odRef} onClick={handleTokenClick}>
                                        <Icon src={WalletIcon} width={'16px'} height={'16px'} />
                                        {odBalance + ' '}{' '}
                                        <div style={{ marginLeft: '10px' }}>
                                            <TokenIcon token="OD" width="20px" />
                                        </div>
                                        <ArrowWrapper>
                                            <ArrowDown fill={isTokenPopupVisible ? '#1499DA' : '#00587E'} />
                                        </ArrowWrapper>
                                    </DollarValue>
                                )}
                                {isTokenPopupVisible && (
                                    <PriceInfoPopup className="group" ref={priceRef}>
                                        <TokenTextWrapper>ADD TOKEN TO WALLET</TokenTextWrapper>
                                        <PopupColumnWrapper>
                                            <PopupWrapperTokenLink onClick={() => handleAddOD()} className="group">
                                                <TokenIcon token="OD" width="24px" />
                                                <PopupColumn>
                                                    <div>OD</div>
                                                </PopupColumn>
                                            </PopupWrapperTokenLink>
                                            <PopupWrapperTokenLink onClick={() => handleAddODG()} className="group">
                                                <TokenIcon token="ODG" width="24px" />
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
                                    <DollarValueInner value={state.odPrice} popup={isPopupVisible} />
                                </DollarValue>
                                {isPopupVisible && (
                                    <LiquidityPriceInfoPopup ref={popupRef} className="group">
                                        <PopupWrapperLink
                                            href="https://info.camelot.exchange/pair/v3/0x824959a55907d5350e73e151ff48dabc5a37a657"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <IconWrapper>
                                                <Camelot />
                                            </IconWrapper>
                                            <PopupColumn>
                                                <div>Liquidity: {state.totalLiquidity}</div>
                                                <CamelotText>View on Camelot Exchange</CamelotText>
                                            </PopupColumn>
                                        </PopupWrapperLink>
                                    </LiquidityPriceInfoPopup>
                                )}
                            </Price>
                            <Price ref={testTokenPopupRef}>
                                {ETH_NETWORK === 'arbitrum-sepolia' && (
                                    <ClaimButton onClick={() => setTestTokenPopupVisibility(!isTestTokenPopupVisible)}>
                                        <Icon src={parachuteIcon} width={22} height={22} />
                                        Test tokens
                                        <ArrowWrapper>
                                            <ArrowDown fill={isTestTokenPopupVisible ? '#1499DA' : '#00587E'} />
                                        </ArrowWrapper>
                                    </ClaimButton>
                                )}
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

                        <NavLinks />
                        {!account && (
                            <ConnectBtnContainer>
                                <Button onClick={handleWalletConnect} text={'connect_wallet'} />
                            </ConnectBtnContainer>
                        )}
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
    font-size: ${(props) => props.theme.font.xSmall};
    color: ${(props) => props.theme.colors.neutral};
    text-align: left;
    font-weight: 600;
    color: white;
    word-wrap: break-word;
    max-width: 100%;
`
const TestTokenPopup = styled.div`
    position: absolute;
    max-width: 150px;
    padding: 8px;
    background: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.neutral};
    border-radius: 8px;
    top: 45px;
`

const PopupColumnWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const TokenTextWrapper = styled.div`
    font-size: ${(props) => props.theme.font.xSmall};
    text-align: left;
    font-weight: 600;
    color: ${(props) => props.theme.colors.neutral};
    margin-bottom: 8px;
`

const OpenDollarInformationColumn = styled.div`
    flex-direction: column;
    padding: 0px 25px;
    display: flex;
    gap: 16px;
`

const ClaimButton = styled.div`
    display: flex;
    padding-left: 12px;
    align-items: center;
    font-size: ${(props) => props.theme.font.small};
`

const PopupColumn = styled.div`
    color: ${(props) => props.theme.colors.neutral};
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

    cursor: pointer;
    background-color: white;
    border-radius: 4px;
    padding: 3px;

    div {
        color: ${(props) => props.theme.colors.primary};
    }
`

const PopupWrapperLink = styled.a`
    display: flex;
    gap: 8px;
    font-size: ${(props) => props.theme.font.small};
    font-weight: 600;
    color: ${(props) => props.theme.colors.primary};
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
    background: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.neutral};
    border-radius: 8px;
    top: 45px;

    a {
        color: inherit;
    }
`

const PriceInfoPopup = styled.div`
    position: absolute;
    z-index: 500;
    min-width: 160px;
    padding: 8px;
    background: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.neutral};
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
    color: ${(props) => props.theme.colors.primary};
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

const DollarValue = styled(OdButton)``

// close button container should be button on right side of screen
const CloseButtonContainer = styled.div`
    padding: 30px;
    cursor: pointer;
    display: flex;
    justify-content: end;
`

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 997;
    overflow-y: auto;
    font-size: ${(props) => props.theme.font.medium};

    &.fade-appear {
        opacity: 0;
    }
    &.fade-appear-active {
        opacity: 1;
        transition: all 300ms;
    }

    @media (min-width: 1073px) {
        display: none;
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
    max-width: 364px;
    background: ${(props) => props.theme.colors.neutral};
    padding-bottom: 1rem;
    position: relative;
    z-index: 2;
    margin-left: auto;
`

const ConnectBtnContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
    margin-right: auto;
    margin-left: auto;

    button {
        border-radius: 3px;
        width: fit-content;
        padding: 15px 45px;
        font-size: ${(props) => props.theme.font.medium};
    }
`

const AccountBalance = styled.div`
    margin-bottom: 15px;
    padding: 15px;
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
