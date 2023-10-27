import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { formatDataNumber, formatNumber, getTokenLogo, newTransactionsFirst, returnWalletAddress } from '~/utils'
import { useStoreActions, useStoreState } from '~/store'
import { handleTransactionError, isTransactionRecent } from '~/hooks'
import Identicon from './Icons/Identicon'
import { Icon } from './TokenInput'
import NavLinks from './NavLinks'
import Button from './Button'
import Brand from './Brand'
import { claimAirdrop } from '~/services/blockchain'
import ArrowDown from './Icons/ArrowDown'
import Camelot from './Icons/Camelot'
import { fetchPoolData } from '@opendollar/sdk'
import { fetchAnalyticsData } from '@opendollar/sdk/lib/virtual/virtualAnalyticsData'
import useGeb from '~/hooks/useGeb'
import { BigNumber, ethers } from 'ethers'

const Navbar = () => {
    const [isPopupVisible, setPopupVisibility] = useState(false)
    const [state, setState] = useState({
        odPrice: '',
        totalLiquidity: '',
    })
    const dollarRef = useRef<HTMLButtonElement | null>(null)
    const popupRef = useRef<HTMLDivElement | null>(null)
    const { t } = useTranslation()
    const { transactionsModel: transactionsState } = useStoreState((state) => state)

    const { transactions } = transactionsState

    const {
        popupsModel: popupsActions,
        transactionsModel,
        connectWalletModel: connectWalletActions,
    } = useStoreActions((state) => state)
    const { connectWalletModel } = useStoreState((state) => state)
    const { isActive, account, provider } = useWeb3React()
    const geb = useGeb()
    const odRef = useRef<HTMLDivElement | null>(null)
    const testTokenPopupRef = useRef<HTMLDivElement | null>(null)
    const [isTokenPopupVisible, setTokenPopupVisibility] = useState(false)
    const [isTestTokenPopupVisible, setTestTokenPopupVisibility] = useState(false)
    const signer = provider ? provider.getSigner(account) : undefined

    const handleTokenClick = () => {
        setTokenPopupVisibility(!isTokenPopupVisible)
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

    const handleDollarClick = () => {
        setPopupVisibility(!isPopupVisible)
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

    const handleWalletConnect = () => {
        if (isActive && account) {
            return popupsActions.setIsConnectedWalletModalOpen(true)
        }
        return popupsActions.setIsConnectorsWalletOpen(true)
    }

    const sortedRecentTransactions = useMemo(() => {
        const txs = Object.values(transactions)
        return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
    }, [transactions])

    const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)

    const hasPendingTransactions = !!pending.length

    const odBalance = useMemo(() => {
        const balances = connectWalletModel.tokensFetchedData
        return formatDataNumber(balances.OD ? balances.OD.balanceE18.toString() : '0', 18, 2, false)
    }, [connectWalletModel.tokensFetchedData])

    const claimAirdropButton = async (signer: any) => {
        popupsActions.setIsWaitingModalOpen(true)
        popupsActions.setWaitingPayload({
            text: 'Claiming test tokens...',
            title: 'Waiting For Confirmation',
            hint: 'Confirm this transaction in your wallet',
            status: 'loading',
        })
        claimAirdrop(signer)
            .then((txResponse) => {
                if (txResponse) {
                    transactionsModel.addTransaction({
                        chainId: txResponse.chainId,
                        hash: txResponse.hash,
                        from: txResponse.from,
                        summary: 'Claiming test tokens',
                        addedTime: new Date().getTime(),
                        originalTx: txResponse,
                    })
                    popupsActions.setWaitingPayload({
                        title: 'Transaction Submitted',
                        hash: txResponse.hash,
                        status: 'success',
                    })
                    txResponse.wait().then(() => {
                        connectWalletActions.setForceUpdateTokens(true)
                    })
                }
            })
            .catch((error) => {
                handleTransactionError(error)
            })
    }

    useEffect(() => {
        async function fetchData() {
            if (geb) {
                try {
                    const [poolData, analyticsData] = await Promise.all([fetchPoolData(geb), fetchAnalyticsData(geb)])

                    const formattedLiquidity = formatDataNumber(
                        ethers.utils
                            .parseEther(BigNumber.from(Math.floor(Number(poolData?.totalLiquidityUSD))).toString())
                            .toString(),
                        18,
                        0,
                        true
                    ).toString()

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

    return (
        <Container>
            <Left isBigWidth={isActive && account ? true : false}>
                <Brand />
                <Price>
                    <DollarValue ref={dollarRef} onClick={handleDollarClick}>
                        <Icon src={getTokenLogo('OD')} width={'16px'} height={'16px'} />
                        <span>{state.odPrice}</span>
                        <ArrowWrapper>
                            <ArrowDown fill={isPopupVisible ? '#1499DA' : '#00587E'} />
                        </ArrowWrapper>
                    </DollarValue>
                    {isPopupVisible && (
                        <LiquidityInfoPopup ref={popupRef} className="group">
                            <PopupWrapperLink className="group">
                                <IconWrapper>
                                    <Camelot />
                                </IconWrapper>
                                <PoupColumn>
                                    <div>Liquidity: {state.totalLiquidity}</div>
                                    <CamelotText>View on Camelot Exchange</CamelotText>
                                </PoupColumn>
                            </PopupWrapperLink>
                        </LiquidityInfoPopup>
                    )}
                </Price>
            </Left>
            <HideMobile>
                <NavLinks />
            </HideMobile>
            <RightSide>
                <BtnContainer ref={testTokenPopupRef}>
                    {signer && (
                        <>
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
                        </>
                    )}
                    {/* Button to add OD and ODG to the wallet */}
                    <RightPriceWrapper ref={odRef}>
                        <DollarValue onClick={handleTokenClick}>
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
                                <Button
                                    style={{ fontWeight: 600 }}
                                    unstyled={true}
                                    primary={account ? true : false}
                                    id="web3-status-connected"
                                    isLoading={hasPendingTransactions}
                                    onClick={handleWalletConnect}
                                >
                                    {isActive && account ? (
                                        hasPendingTransactions ? (
                                            `${pending.length} Pending`
                                        ) : (
                                            <InnerBtn>
                                                <IdenticonWrapper>
                                                    <Identicon />
                                                </IdenticonWrapper>
                                                {returnWalletAddress(account)}
                                            </InnerBtn>
                                        )
                                    ) : (
                                        t('connect_wallet')
                                    )}
                                </Button>
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
                    </RightPriceWrapper>
                    <FixedContainer>
                        <Button
                            style={{ fontSize: 12 }}
                            unstyled={true}
                            primary={account ? true : false}
                            id="web3-status-connected"
                            isLoading={hasPendingTransactions}
                            onClick={handleWalletConnect}
                        >
                            {isActive && account ? (
                                hasPendingTransactions ? (
                                    `${pending.length} Pending`
                                ) : (
                                    <InnerBtnSmallerAddress>
                                        <SmallerIdenticonWrapper>
                                            <Identicon />
                                        </SmallerIdenticonWrapper>
                                        {returnWalletAddress(account)}
                                    </InnerBtnSmallerAddress>
                                )
                            ) : (
                                t('connect_wallet')
                            )}
                        </Button>
                    </FixedContainer>
                </BtnContainer>

                <MenuBtn onClick={() => popupsActions.setShowSideMenu(true)}>
                    <RectContainer>
                        <Rect />
                        <Rect />
                        <Rect />
                    </RectContainer>
                </MenuBtn>
            </RightSide>
        </Container>
    )
}

export default Navbar

const SmallerIdenticonWrapper = styled.div<{ size?: number }>`
    display: flex;
    & > img,
    span,
    svg {
        height: ${({ size }) => (size ? size + 'px' : '12px')};
        width: ${({ size }) => (size ? size + 'px' : '12px')};
    }

    div {
        height: ${({ size }) => (size ? size + 'px' : '12px')} !important;
        width: ${({ size }) => (size ? size + 'px' : '12px')} !important;
        svg {
            rect {
                height: ${({ size }) => (size ? size + 'px' : '12px')} !important;
                width: ${({ size }) => (size ? size + 'px' : '12px')} !important;
            }
        }
    }
`
const FixedContainer = styled.div`
    position: absolute;
    top: 84px;
    right: 73px;
    z-index: -1;
`

const IdenticonWrapper = styled.div<{ size?: number }>`
    display: flex;
    & > img,
    span,
    svg {
        height: ${({ size }) => (size ? size + 'px' : '24px')};
        width: ${({ size }) => (size ? size + 'px' : '24px')};
    }

    div {
        height: ${({ size }) => (size ? size + 'px' : '22.6px')} !important;
        width: ${({ size }) => (size ? size + 'px' : '24px')} !important;
        svg {
            rect {
                height: ${({ size }) => (size ? size + 'px' : '22.6px')} !important;
                width: ${({ size }) => (size ? size + 'px' : '24px')} !important;
            }
        }
    }
`

const CamelotText = styled.div`
    font-size: xx-small;
    font-weight: 400;
    color: #ffaf1d;
`

const PopupColumn = styled.div`
    text-align: end;
`

const PopupWrapperTokenLink = styled.a`
    display: flex;
    gap: 8px;
    font-size: ${(props) => props.theme.font.small};
    font-weight: 600;
    color: ${(props) => props.theme.colors.neutral};
    cursor: pointer;
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

const screenWidth = '1073px'

const Container = styled.div`
    display: flex;
    height: 68px;
    align-items: center;
    justify-content: space-between;
    padding: 40px 40px 0 40px;
    position: relative;
    z-index: 5;

    @media (max-width: ${screenWidth}) {
        padding: 0 20px;
        top: 0 !important;
    }
`

const MenuBtn = styled.div`
    margin-right: -20px;
    width: 60px;
    height: 60px;
    align-items: center;
    justify-content: center;
    display: none;
    cursor: pointer;
    &:hover {
        div {
            div {
                background: ${(props) => props.theme.colors.gradient};
            }
        }
    }

    @media (max-width: ${screenWidth}) {
        display: flex;
    }
`

const BtnContainer = styled.div`
    display: flex;
    align-items: center;

    @media (max-width: ${screenWidth}) {
        display: none;
    }

    svg {
        position: relative;
        margin-right: 0px;
    }
`

const RectContainer = styled.div``

const Rect = styled.div`
    width: 15px;
    border-radius: 12px;
    height: 3px;
    margin-bottom: 2px;
    background: ${(props) => props.theme.colors.secondary};
    transition: all 0.3s ease;
    &:last-child {
        margin-bottom: 0;
    }
`

const RightSide = styled.div`
    display: flex;
    align-items: center;
`

const HideMobile = styled.div`
    height: -webkit-fill-available;
    @media (max-width: ${screenWidth}) {
        display: none;
    }
`

const Left = styled.div<{ isBigWidth?: boolean }>`
    display: flex;
    align-items: center;

    @media (max-width: ${screenWidth}) {
        min-width: auto;
    }
`

const Flex = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
`

const InnerBtn = styled(Flex)`
    div {
        display: block !important;
        margin-right: 5px;
        svg {
            top: 0 !important;
        }
    }
`

const InnerBtnSmallerAddress = styled(Flex)`
    div {
        display: block !important;
        margin-right: 2.5px;
        svg {
            top: 0 !important;
        }
    }
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
    margin-right: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    &:hover {
        opacity: 0.8;
    }
`

const RightPriceWrapper = styled.div`
    position: relative;
    margin-right: auto;

    @media (max-width: ${screenWidth}) {
        display: none;
    }
`

const Price = styled.div`
    position: relative;
    margin-right: auto;
    margin-left: 32px;

    @media (max-width: ${screenWidth}) {
        display: none;
    }
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
    top: 80px;
`

const LiquidityInfoPopup = styled.div`
    position: absolute;
    min-width: 190px;
    padding: 8px;
    background: ${(props) => props.theme.colors.colorPrimary};
    border-radius: 8px;
    top: 45px;
`

const PriceInfoPopup = styled.div`
    position: absolute;
    min-width: 160px;
    padding: 8px;
    background: ${(props) => props.theme.colors.colorPrimary};
    border-radius: 8px;
    top: 45px;
`

const PopupWrapperLink = styled.a`
    display: flex;
    gap: 8px;
    font-size: ${(props) => props.theme.font.small};
    font-weight: 600;
    color: ${(props) => props.theme.colors.neutral};
`

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
`

const PoupColumn = styled.div`
    text-align: end;
`

const ArrowWrapper = styled.div`
    margin-left: 8px;
`

const ClaimButton = styled(OdButton)``

const DollarValue = styled(OdButton)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: auto;
    white-space: nowrap;
`
