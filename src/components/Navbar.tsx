import { useMemo, useState, useRef, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components'

import { ETH_NETWORK, formatDataNumber, getTokenLogo, newTransactionsFirst, returnWalletAddress } from '~/utils'
import { useStoreActions, useStoreState } from '~/store'
import { isTransactionRecent } from '~/hooks'
import Identicon from './Icons/Identicon'
import { Icon } from './TokenInput'
import NavLinks from './NavLinks'
import Button from './Button'
import Brand from './Brand'
import ArrowDown from './Icons/ArrowDown'
import Camelot from './Icons/Camelot'
import useGeb from '~/hooks/useGeb'
import { BigNumber, ethers } from 'ethers'
import BlockBodyContainer from './BlockBodyContainer'
import parachuteIcon from '../assets/parachute-icon.svg'
import discordIcon from '../assets/discord.svg'
import Loader from './Loader'
import useAnalyticsData from '~/hooks/useAnalyticsData'
import usePoolData from '~/hooks/usePoolData'
import TokenIcon from './TokenIcon'
import walletIcon from '../assets/wallet-icon.svg'
import DollarValueInner from './DollarValueInner'

const Navbar = () => {
    const theme = useTheme()
    const { settingsModel: settingsState } = useStoreState((state) => state)

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
    const poolData = usePoolData()
    const analyticsData = useAnalyticsData()

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
        return formatDataNumber(balances.OD ? balances.OD.balanceE18.toString() : '0', 18, 2, false, true)
    }, [connectWalletModel.tokensFetchedData])

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
        document.addEventListener('mousedown', handleClickOutsideOdWallet)
        return () => {
            // Cleanup the event listener on component unmount
            document.removeEventListener('mousedown', handleClickOutsideOdRef)
            document.removeEventListener('mousedown', handleClickOutsideTestToken)
            document.removeEventListener('mousedown', handleClickOutsideOdWallet)
        }
    }, [poolData, chainId, analyticsData, geb])

    return (
        <ContainerShadowWrapper>
            <Container>
                <ContentWrapper>
                    {settingsState.blockBody && <BlockBodyContainer header />}
                    <Left>
                        <Brand />
                        <Price>
                            <DollarValue ref={dollarRef} onClick={handleDollarClick}>
                                {/* <Icon src={getTokenLogo('OD')} width={22} height={22} />
                                {state.odPrice ? <span>{state.odPrice}</span> : <Loader color="#0071E7" width="20px" />}
                                <ArrowWrapper>
                                    <ArrowDown fill={isPopupVisible ? '#1499DA' : '#00587E'} />
                                </ArrowWrapper> */}
                                <DollarValueInner value={state.odPrice} popup={isPopupVisible} />
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
                                                    <a
                                                        href="https://info.camelot.exchange/pair/v3/0x824959a55907d5350e73e151ff48dabc5a37a657"
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        {t('view_on_camelot_exchange')}
                                                    </a>
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
                                    {ETH_NETWORK === 'arbitrum-sepolia' && (
                                        <ClaimButton
                                            onClick={() => setTestTokenPopupVisibility(!isTestTokenPopupVisible)}
                                        >
                                            <Icon src={parachuteIcon} width={22} height={22} />
                                            Tokens
                                            <ArrowWrapper>
                                                <ArrowDown fill={isTestTokenPopupVisible ? '#1499DA' : '#00587E'} />
                                            </ArrowWrapper>
                                        </ClaimButton>
                                    )}
                                    {isTestTokenPopupVisible && (
                                        <InfoPopup className="group">
                                            <InfoPopupContentWrapper>
                                                <Flex
                                                    style={{ alignItems: 'flex-start', cursor: 'pointer' }}
                                                    onClick={handleLinkToDiscord}
                                                >
                                                    <img src={discordIcon} alt="Discord" />
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
                                    <TotalValue onClick={handleTokenClick}>
                                        <Icon src={walletIcon} width={22} height={22} />
                                        <OdBalanceWrapper>{odBalance + ' '}</OdBalanceWrapper>{' '}
                                        <TokenIcon token={'OD'} width={'22px'} />
                                        <ArrowWrapper>
                                            <ArrowDown fill={isTokenPopupVisible ? '#1499DA' : '#00587E'} />
                                        </ArrowWrapper>
                                    </TotalValue>
                                    {isTokenPopupVisible && (
                                        <InfoPopup className="group wallet">
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
                                                        <TokenIcon token={'OD'} width="24px" />
                                                        <PopupColumn>
                                                            <InfoPopUpSubText>OD</InfoPopUpSubText>
                                                        </PopupColumn>
                                                    </PopupWrapperTokenLink>
                                                    <PopupWrapperTokenLink
                                                        onClick={() => handleAddODG()}
                                                        className="group"
                                                    >
                                                        <TokenIcon token={'ODG'} width="24px" />
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
                                        fontSize: 14,
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
    gap: 7px;
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

    &:after {
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
    padding: 0 15px;
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
    padding: 10px 18px 8px;
    box-shadow: 0 4px ${(props) => props.theme.colors.primary};
    font-size: ${(props) => props.theme.font.xxSmall};
    font-weight: 700;
    border-width: 1px;
    border-color: ${(props) => props.theme.colors.primary};
    border-radius: 50px;
    transition: all 0.15s ease;
    box-sizing: border-box;
    min-width: max-content;
    width: auto;
    height: 44px;

    &:hover {
        transform: translateY(-0.5px);
        box-shadow: 0 4.5px ${(props) => props.theme.colors.primary};
        background: ${(props) => props.theme.colors.neutral}33;
    }
`

const RightPriceWrapper = styled.div`
    margin-right: auto;
    position: relative;

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
    background-color: white;
    border-radius: 4px;
    top: 85px;
    width: 15vw;
    max-width: 210px;

    &.wallet {
        top: 68px;
        right: 0;
    }
`

const PopupWrapperLink = styled.a`
    gap: 8px;
    font-size: ${(props) => props.theme.font.small};
    font-weight: 600;
    color: ${(props) => props.theme.colors.neutral};
`

const ArrowWrapper = styled.div`
    margin-left: 8px;
`

const ClaimButton = styled(OdButton)`
    padding-left: 30px;
    padding-right: 30px;
`

const DollarValue = styled(OdButton)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
`

const TotalValue = styled(OdButton)``

const InfoPopUpHorizontalSeparator = styled.div`
    width: 100%;
    height: 1px;
    background: ${(props) => props.theme.colors.accent}33;
`

const InfoPopupContentWrapper = styled.div`
    padding: 16px;
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

const OdBalanceWrapper = styled.span`
    margin-right: 7px;
`
