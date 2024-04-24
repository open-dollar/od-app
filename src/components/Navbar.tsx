import { useMemo, useState, useRef, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'

import { formatDataNumber, getTokenLogo, newTransactionsFirst, returnWalletAddress } from '~/utils'
import { useStoreActions, useStoreState } from '~/store'
import { isTransactionRecent } from '~/hooks'
import Identicon from './Icons/Identicon'
import { Icon } from './TokenInput'
import NavLinks from './NavLinks'
import Button from './Button'
import Brand from './Brand'
import ArrowDown from './Icons/ArrowDown'
import Camelot from './Icons/Camelot'
import { fetchPoolData } from '@opendollar/sdk'
import { fetchAnalyticsData } from '@opendollar/sdk/lib/virtual/virtualAnalyticsData'
import useGeb from '~/hooks/useGeb'
import { BigNumber, ethers } from 'ethers'

const Navbar = () => {
    const theme = useTheme()

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

    const { popupsModel: popupsActions } = useStoreActions((state) => state)
    const { connectWalletModel } = useStoreState((state) => state)
    const { isActive, account, provider, chainId } = useWeb3React()
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

    const handleLinkToDiscord = () => {
        window.open('https://discord.opendollar.com/', '_blank')
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

    useEffect(() => {
        if (chainId !== 421614 && chainId !== 42161 && chainId !== 10) return
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
    }, [geb, chainId]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <ContainerShadowWrapper>
            <Container>
                <ContentWrapper>
                    <Left>
                        <Brand />
                        <Price>
                            <DollarValue ref={dollarRef} onClick={handleDollarClick}>
                                <Icon src={getTokenLogo('OD')} width={22} height={22} />
                                <span>{state.odPrice}</span>
                                <ArrowWrapper>
                                    {/* @ts-ignore */}
                                    <ArrowDown fill={theme.colors.primary} />
                                </ArrowWrapper>
                            </DollarValue>
                            {isPopupVisible && (
                                <InfoPopup ref={popupRef}>
                                    <PopupWrapperLink>
                                        <InfoPopupContentWrapper>
                                            <InfoPopUpText style={{ marginBottom: 6 }}>
                                                {t('liquidity').toUpperCase()}
                                            </InfoPopUpText>
                                            {/* @ts-ignore */}
                                            <InfoPopUpText style={{ fontSize: theme.font.default }}>
                                                {state.totalLiquidity}
                                            </InfoPopUpText>
                                        </InfoPopupContentWrapper>
                                        <InfoPopUpHorizontalSeparator />
                                        <InfoPopupContentWrapper>
                                            <Flex>
                                                <Camelot />
                                                <InfoPopUpSubText style={{ marginLeft: '10px' }}>
                                                    {t('view_on_camelot_exchange')}
                                                </InfoPopUpSubText>
                                            </Flex>
                                        </InfoPopupContentWrapper>
                                    </PopupWrapperLink>
                                </InfoPopup>
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
                                        <Icon
                                            src={require('../assets/parachute-icon.svg').default}
                                            width={22}
                                            height={22}
                                        />
                                        Tokens
                                        <ArrowWrapper>
                                            <ArrowDown fill={isTestTokenPopupVisible ? '#1499DA' : '#00587E'} />
                                        </ArrowWrapper>
                                    </ClaimButton>
                                    {isTestTokenPopupVisible && (
                                        <InfoPopup className="group">
                                            <InfoPopupContentWrapper>
                                                <Flex
                                                    style={{ alignItems: 'flex-start', cursor: 'pointer' }}
                                                    onClick={handleLinkToDiscord}
                                                >
                                                    <img src={require('../assets/discord.svg').default} alt="Discord" />
                                                    <InfoPopUpSubText style={{ marginLeft: 10 }}>
                                                        {t('claim_on_discord')}
                                                    </InfoPopUpSubText>
                                                </Flex>
                                            </InfoPopupContentWrapper>
                                        </InfoPopup>
                                    )}
                                </>
                            )}
                        </BtnContainer>
                        <BtnContainer>
                            {account ? (
                                <RightPriceWrapper ref={odRef} style={{ marginLeft: 20 }}>
                                    <DollarValue onClick={handleTokenClick}>
                                        <Icon
                                            src={require('../assets/wallet-icon.svg').default}
                                            width={22}
                                            height={22}
                                        />
                                        {odBalance + ' '} OD
                                        <ArrowWrapper>
                                            <ArrowDown fill={isTokenPopupVisible ? '#1499DA' : '#00587E'} />
                                        </ArrowWrapper>
                                    </DollarValue>
                                    {isTokenPopupVisible && (
                                        <InfoPopup className="group">
                                            <InfoPopupContentWrapper>
                                                <Button
                                                    style={{ fontWeight: 600 }}
                                                    unstyled={true}
                                                    primary={account ? true : false}
                                                    id="web3-status-connected"
                                                    isLoading={hasPendingTransactions}
                                                    onClick={handleWalletConnect}
                                                >
                                                    {hasPendingTransactions ? (
                                                        `${pending.length} Pending`
                                                    ) : (
                                                        <InnerBtn>
                                                            <IdenticonWrapper>
                                                                <Identicon />
                                                            </IdenticonWrapper>
                                                            <InfoPopUpText>
                                                                {returnWalletAddress(account)}
                                                            </InfoPopUpText>
                                                        </InnerBtn>
                                                    )}
                                                </Button>
                                            </InfoPopupContentWrapper>
                                            <InfoPopUpHorizontalSeparator />
                                            <InfoPopupContentWrapper style={{ paddingTop: 12 }}>
                                                <InfoPopUpSubText style={{ marginBottom: 12 }}>
                                                    {t('add_token_to_wallet')}
                                                </InfoPopUpSubText>
                                                <Flex style={{ justifyContent: 'flex-start' }}>
                                                    <PopupWrapperTokenLink
                                                        onClick={() => handleAddOD()}
                                                        className="group"
                                                        style={{ marginRight: 10 }}
                                                    >
                                                        <IconWrapper>
                                                            <img
                                                                src={require('../assets/od-logo.svg').default}
                                                                height={'24px'}
                                                                width={'24px'}
                                                                alt="X"
                                                            />
                                                        </IconWrapper>
                                                        <PopupColumn>
                                                            <InfoPopUpSubText>OD</InfoPopUpSubText>
                                                        </PopupColumn>
                                                    </PopupWrapperTokenLink>
                                                    <PopupWrapperTokenLink
                                                        onClick={() => handleAddODG()}
                                                        className="group"
                                                    >
                                                        <IconWrapper>
                                                            <img
                                                                src={require('../assets/odg.svg').default}
                                                                height={'24px'}
                                                                width={'24px'}
                                                                alt="X"
                                                            />
                                                        </IconWrapper>
                                                        <PopupColumn>
                                                            <InfoPopUpSubText>ODG</InfoPopUpSubText>
                                                        </PopupColumn>
                                                    </PopupWrapperTokenLink>
                                                </Flex>
                                            </InfoPopupContentWrapper>
                                        </InfoPopup>
                                    )}
                                </RightPriceWrapper>
                            ) : (
                                <ClaimButton
                                    style={{
                                        marginLeft: '20px',
                                        textAlign: 'center',
                                        justifyContent: 'center',
                                        fontSize: 13,
                                    }}
                                    onClick={handleWalletConnect}
                                >
                                    {t('connect_wallet').toUpperCase()}
                                </ClaimButton>
                            )}
                        </BtnContainer>

                        <MenuBtn onClick={() => popupsActions.setShowSideMenu(true)}>
                            <RectContainer>
                                <Rect />
                                <Rect />
                                <Rect />
                            </RectContainer>
                        </MenuBtn>
                    </RightSide>
                </ContentWrapper>
            </Container>
        </ContainerShadowWrapper>
    )
}

export default Navbar

const Flex = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
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

const PopupColumn = styled.div`
    text-align: end;
`

const PopupWrapperTokenLink = styled.a`
    display: flex;
    gap: 10px;
    font-size: ${(props) => props.theme.font.small};
    font-weight: 600;
    color: ${(props) => props.theme.colors.neutral};
    cursor: pointer;
    align-items: center;
    transition: all 0.3s ease;
    border-radius: 4px;

    &:hover {
        background-color: #f2f2f2;
    }
`

const screenWidth = '1073px'

const Container = styled.div`
    display: flex;
    height: 77px;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 5;
    width: 100%;
    background: ${(props) => props.theme.colors.neutral};
    box-shadow: 0 8px linear-gradient(360deg, #d8e1ff -10.39%, #e2e8fb 0%);

    @media (max-width: ${screenWidth}) {
        padding: 0 20px;
        top: 0 !important;
    }

    $:after {
        content: '';
        display: block;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: 8px;
        background: linear-gradient(360deg, #d8e1ff -10.39%, #e2e8fb 0%);
        z-index: 1;
    }
`

// Needed for a linear gradient shadow that doesn't bleed into the content
const ContainerShadowWrapper = styled(Flex)`
    background: linear-gradient(360deg, #d8e1ff -10.39%, #e2e8fb 0%);
    padding: 0 0 8px 0;
`

const ContentWrapper = styled(Flex)`
    height: 100%;
    justify-content: space-between;
    width: 100%;
    max-width: 1360px;
`

const MenuBtn = styled.div`
    margin-right: -20px;
    width: 60px;
    height: 60px;
    align-items: center;
    justify-content: center;
    display: none;
    cursor: pointer;

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
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    @media (max-width: ${screenWidth}) {
        display: none;
    }
`

const Left = styled.div`
    display: flex;
    align-items: center;

    @media (max-width: ${screenWidth}) {
        min-width: auto;
    }
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

const OdButton = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    color: ${(props) => props.theme.colors.accent};
    width: 15vw;
    max-width: 210px;
    padding: 10px 12px 8px 12px;
    box-shadow: 0 4px ${(props) => props.theme.colors.primary};
    font-size: ${(props) => props.theme.font.xxSmall};
    font-weight: 700;
    border-width: 1px;
    border-color: ${(props) => props.theme.colors.primary};
    border-radius: 50px;
    transition: all 0.15s ease;
    box-sizing: border-box;

    &:hover {
        transform: translateY(-0.5px);
        box-shadow: 0 4.5px ${(props) => props.theme.colors.primary};
        background: ${(props) => props.theme.colors.neutral}33;
    }
`

const RightPriceWrapper = styled.div`
    margin-right: auto;

    @media (max-width: ${screenWidth}) {
        display: none;
    }
`

const Price = styled.div`
    margin-right: auto;
    margin-left: 32px;

    @media (max-width: ${screenWidth}) {
        display: none;
    }
`

const InfoPopup = styled.div`
    position: absolute;
    background: ${(props) => props.theme.colors.background};
    border-radius: 14px;
    top: 75px;
    border-width: 1px;
    border-color: ${(props) => props.theme.colors.neutral};
    width: 15vw;
    max-width: 210px;
`

const PopupWrapperLink = styled.a`
    gap: 8px;
    font-size: ${(props) => props.theme.font.small};
    font-weight: 600;
    color: ${(props) => props.theme.colors.neutral};
`

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
`

const ArrowWrapper = styled.div`
    margin-left: 8px;
`

const ClaimButton = styled(OdButton)``

const DollarValue = styled(OdButton)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
`

const InfoPopUpHorizontalSeparator = styled.div`
    width: 100%;
    height: 1px;
    background: ${(props) => props.theme.colors.accent}33;
`

const InfoPopupContentWrapper = styled.div`
    padding: 16px;
    background: ${(props) => props.theme.colors.neutral};
`

const InfoPopUpText = styled.div`
    font-size: ${(props) => props.theme.font.xSmall};
    line-height: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.accent};
    font-weight: 500;
    font-family: 'Barlow', sans-serif;
`
const InfoPopUpSubText = styled.div`
    font-size: 13px;
    line-height: ${(props) => props.theme.font.xSmall};
    color: ${(props) => props.theme.colors.accent};
    font-weight: 500;
`
