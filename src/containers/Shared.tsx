import React, { ReactNode, useEffect, useCallback, Suspense } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { isAddress } from '@ethersproject/address'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import { useActiveWeb3React } from '~/hooks'
import { useStoreState, useStoreActions } from '~/store'
import usePrevious from '~/hooks/usePrevious'
import { NETWORK_ID } from '~/connectors'
import useGeb from '~/hooks/useGeb'
import {
    ETHERSCAN_PREFIXES,
    blockedAddresses,
    capitalizeName,
    EMPTY_ADDRESS,
    SYSTEM_STATUS,
    ChainId,
    IS_IN_IFRAME,
    timeout,
} from '~/utils'
import useTokenData from '~/hooks/useTokenData'
import useSafeData from '~/hooks/useSafeData'
import useCoinBalanceUpdate from '~/hooks/useCoinBalanceUpdate'
import useAuctionDataUpdate from '~/hooks/useAuctionDataUpdate'
import useAllowanceCheck from '~/hooks/useAllowanceCheck'

import checkGeoBlockAndSanctions from '~/services/checkGeoBlockAndSanctions'
import ToastPayload from '~/components/ToastPayload'
import WalletModal, { checkAndSwitchMetamaskNetwork } from '~/components/WalletModal'
import SideMenu from '~/components/SideMenu'
import Navbar from '~/components/Navbar'
import AlertLabel from '~/components/AlertLabel'
import BlockedAddress from '~/components/BlockedAddress'
import CookieBanner from '~/components/CookieBanner'
import Footer from '~/components/Footer'
import ApplicationUpdater from '~/services/ApplicationUpdater'
import TransactionUpdater from '~/services/TransactionUpdater'
import BalanceUpdater from '~/services/BalanceUpdater'
import MulticallUpdater from '~/services/MulticallUpdater'
import ScreenLoader from '~/components/Modals/ScreenLoader'
import ToastBannerNetwork from '~/components/ToastBannerNetwork'

const ConnectedWalletModal = React.lazy(() => import('~/components/Modals/ConnectedWalletModal'))
const AuctionsModal = React.lazy(() => import('~/components/Modals/AuctionsModal'))
const TopUpModal = React.lazy(() => import('~/components/Modals/SafeManagerModal'))
const WaitingModal = React.lazy(() => import('~/components/Modals/WaitingModal'))
const LoadingModal = React.lazy(() => import('~/components/Modals/LoadingModal'))
const ProxyModal = React.lazy(() => import('~/components/Modals/ProxyModal'))
const WethModal = React.lazy(() => import('~/components/Modals/WETHModal'))
const LiquidateSafeModal = React.lazy(() => import('~/components/Modals/LiquidateSafeModal'))
const ImagePreloader = React.lazy(() => import('~/components/ImagePreloader'))

interface Props {
    children: ReactNode
}

const Shared = ({ children, ...rest }: Props) => {
    const { t } = useTranslation()
    const { chainId, account, provider, connector } = useActiveWeb3React()

    const geb = useGeb()
    const navigate = useNavigate()

    const previousAccount = usePrevious(account)

    const location = useLocation()

    const isGeofenceEnabled: boolean = process.env.REACT_APP_GEOFENCE_ENABLED === 'true'

    const tokensData = geb?.tokenList

    const { connectWalletModel: connectWalletState } = useStoreState((state) => state)

    const {
        settingsModel: settingsActions,
        connectWalletModel: connectWalletActions,
        popupsModel: popupsActions,
        transactionsModel: transactionsActions,
        safeModel: safeActions,
    } = useStoreActions((state) => state)
    useTokenData()
    useSafeData()
    useCoinBalanceUpdate()
    useAuctionDataUpdate()
    useAllowanceCheck()

    const toastId = 'networkToastHash'
    const sanctionsToastId = 'sanctionsToastHash'

    const resetModals = () => {
        popupsActions.setIsConnectedWalletModalOpen(false)
        popupsActions.setIsConnectModalOpen(false)
        popupsActions.setIsLoadingModalOpen({ text: '', isOpen: false })
        popupsActions.setIsScreenModalOpen(false)
        popupsActions.setIsSettingModalOpen(false)
        popupsActions.setIsScreenModalOpen(false)
        popupsActions.setIsWaitingModalOpen(false)
        popupsActions.setIsVotingModalOpen(false)
        popupsActions.setShowSideMenu(false)
        popupsActions.setIsBridgeModalOpen(false)
    }

    haiUserCheck()

    useEffect(() => {
        connectWalletActions.setTokensData(tokensData)
    }, [connectWalletActions, tokensData])

    async function accountChecker() {
        if (!account || !chainId || !provider || !geb) return

        try {
            connectWalletActions.setProxyAddress('')
            const userProxy = await geb.getProxyAction(account)
            if (userProxy && userProxy.proxyAddress && userProxy.proxyAddress !== EMPTY_ADDRESS) {
                connectWalletActions.setProxyAddress(userProxy.proxyAddress)
            }
            const txs = localStorage.getItem(`${account}-${chainId}`)
            if (txs) {
                transactionsActions.setTransactions(JSON.parse(txs))
            }
            await timeout(200)
            if (!connectWalletState.ctHash) {
                connectWalletActions.setStep(2)
                const { pathname } = location

                let address = ''
                if (pathname && pathname !== '/' && pathname !== '/vaults') {
                    const route = pathname.split('/')[1]
                    if (isAddress(route)) {
                        address = route.toLowerCase()
                    }
                }
                await safeActions.fetchUserSafes({
                    address: address ? address : (account as string),
                    geb,
                    tokensData,
                })
            }
        } catch (error) {
            safeActions.setIsSafeCreated(false)
            connectWalletActions.setStep(1)
            popupsActions.setIsWaitingModalOpen(false)
        }
    }

    function accountChange() {
        resetModals()
        const isAccountSwitched = account && previousAccount && account !== previousAccount
        if (!account) {
            connectWalletActions.setStep(0)
            safeActions.setIsSafeCreated(false)
            transactionsActions.setTransactions({})
        }
        if (isAccountSwitched) {
            navigate('/')
            transactionsActions.setTransactions({})
        }
    }

    async function haiUserCheck() {
        if (process.env.REACT_APP_NETWORK_ID === '10') {
            toast(<ToastBannerNetwork />, { autoClose: false, type: 'warning', toastId: sanctionsToastId })
        }
    }

    async function sanctionsAndGeoBlockCheck() {
        if (account && (isGeofenceEnabled || process.env.NODE_ENV === 'production')) {
            const botAPIResponse = await checkGeoBlockAndSanctions(account)
            const isBlocked = botAPIResponse.data?.message?.includes('geoblocked')
            const isSanctioned = botAPIResponse?.identifications.length > 0
            if (isBlocked && isGeofenceEnabled) {
                popupsActions.setIsConnectedWalletModalOpen(false)
                popupsActions.setIsConnectorsWalletOpen(false)
                navigate('/geoblock')
                connectWalletActions.setIsWrongNetwork(true)
                settingsActions.setBlockBody(true)
                return false
            } else if (isSanctioned && process.env.NODE_ENV === 'production') {
                connectWalletActions.setIsWrongNetwork(true)
                toast(
                    <ToastPayload
                        icon={'AlertTriangle'}
                        iconSize={40}
                        iconColor={'orange'}
                        textColor={'#ffffff'}
                        text={`${t('sanctioned_wallet')}`}
                    />,
                    { autoClose: false, type: 'warning', toastId: sanctionsToastId }
                )
            } else {
                return true
            }
        }
        return true
    }
    const address: string = account ?? ''
    useEffect(() => {
        if (chainId !== 421614 && chainId !== 42161 && chainId !== 10) return
        if (
            (!account && !address) ||
            (address && !isAddress(address.toLowerCase())) ||
            !provider ||
            connectWalletState.isWrongNetwork
        )
            return

        async function fetchSafes() {
            await safeActions.fetchUserSafes({
                address: address || (account as string),
                geb,
                tokensData: connectWalletState.tokensData,
            })
        }
        if (geb && connectWalletState.tokensData) {
            fetchSafes()
        }
        //@to-do: find a better way to fetch safes
        const ms = 3000
        const interval = setInterval(() => {
            if (
                (!account && !address) ||
                (address && !isAddress(address.toLowerCase())) ||
                !provider ||
                connectWalletState.isWrongNetwork
            )
                fetchSafes()
        }, ms)

        return () => clearInterval(interval)
    }, [
        account,
        address,
        connectWalletState.isWrongNetwork,
        connectWalletState.tokensData,
        geb,
        provider,
        safeActions,
        chainId,
    ])

    async function networkChecker() {
        accountChange()
        const id: ChainId = NETWORK_ID
        popupsActions.setIsSafeManagerOpen(false)
        // Gnosis Safe is not compatible with Arbitrum testnets
        if (connector && IS_IN_IFRAME && id !== 42161) {
            connectWalletActions.setIsWrongNetwork(true)
            toast(
                <ToastPayload
                    icon={'AlertTriangle'}
                    iconSize={40}
                    iconColor={'orange'}
                    textColor={'#ffffff'}
                    text={`${t('gnosis_safe_mainnet_only')}`}
                />,
                { autoClose: false, type: 'warning', toastId }
            )
            return
        }

        if (document.querySelector('#networkToastHash') !== null) {
            document.querySelector('#networkToastHash')?.remove()
        }
        settingsActions.setBlockBody(false)
        connectWalletActions.setIsWrongNetwork(false)
        if (account) {
            sanctionsAndGeoBlockCheck()
            connectWalletActions.setStep(1)
            accountChecker()
        }
    }
    /*eslint-disable-next-line*/
    const networkCheckerCallBack = useCallback(networkChecker, [account, chainId, geb])

    useEffect(() => {
        networkCheckerCallBack()
    }, [account, geb?.getProxyAction]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (chainId && chainId === NETWORK_ID) {
            if (document.querySelector(toastId) !== null) {
                toast.dismiss(toastId)
            }
        }
        if (chainId && chainId !== NETWORK_ID) {
            const id: ChainId = NETWORK_ID
            const chainName = ETHERSCAN_PREFIXES[id]
            connectWalletActions.setIsWrongNetwork(true)
            toast(
                <ToastPayload
                    icon={'AlertTriangle'}
                    iconSize={40}
                    iconColor={'orange'}
                    textColor={'#ffffff'}
                    text={`${t('wrong_network')} ${capitalizeName(chainName === '' ? 'Arbitrum' : chainName)}`}
                />,
                { autoClose: false, type: 'warning', toastId }
            )
        } else {
            if (document.querySelector(toastId) !== null) {
                document.querySelector(toastId)?.remove()
            }
            settingsActions.setBlockBody(false)
            connectWalletActions.setIsWrongNetwork(false)
            if (account) {
                sanctionsAndGeoBlockCheck()
                accountChecker()
            }
            checkAndSwitchMetamaskNetwork()
        }
    }, [chainId, window.ethereum, account, provider, geb]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Container>
            <Suspense fallback={<ScreenLoader />}>
                <SideMenu />
                <WalletModal />
                <MulticallUpdater />
                <ApplicationUpdater />
                <BalanceUpdater />
                <TransactionUpdater />
                <LoadingModal />
                <AuctionsModal />
                <WethModal />
                <ProxyModal />
                <ConnectedWalletModal />
                <ScreenLoader />
                <LiquidateSafeModal />
                <WaitingModal />
                <TopUpModal />
                <EmptyDiv>
                    <Navbar />
                </EmptyDiv>
                {SYSTEM_STATUS && SYSTEM_STATUS.toLowerCase() === 'shutdown' ? (
                    <AlertContainer>
                        <AlertLabel type="danger" text={t('shutdown_text')} />
                    </AlertContainer>
                ) : null}
                {account && blockedAddresses.includes(account.toLowerCase()) ? (
                    <BlockedAddress />
                ) : (
                    <Content>{children}</Content>
                )}
                <EmptyDiv>
                    <CookieBanner />
                </EmptyDiv>
                <ImagePreloader />
                <EmptyDiv>
                    <Footer />
                </EmptyDiv>
            </Suspense>
        </Container>
    )
}

export default Shared

const Container = styled.div`
    min-height: 100vh;
    .CookieConsent {
        z-index: 999 !important;
        bottom: 20px !important;
        width: 90% !important;
        max-width: 1280px;
        margin: 0 auto;
        right: 0;
        border-radius: ${(props) => props.theme.global.borderRadius};
        padding: 10px 20px;
        background: ${(props) => props.theme.colors.foreground} !important;
        button {
            background: ${(props) => props.theme.colors.blueish} !important;
            color: ${(props) => props.theme.colors.neutral} !important;
            padding: 8px 15px !important;
            background: ${(props) => props.theme.colors.gradient};
            border-radius: 25px !important;
            font-size: ${(props) => props.theme.font.small};
            font-weight: 600;
            cursor: pointer;
            flex: 0 0 auto;
            margin: 0px 15px 0px 0px !important;
            text-align: center;
            outline: none;
            position: relative;
            top: -5px;
        }

        @media (max-width: 991px) {
            display: block !important;
            button {
                margin-left: 10px !important;
            }
        }
    }
`

const Content = styled.div`
    min-height: 100vh;
`
const EmptyDiv = styled.div``

const AlertContainer = styled.div`
    padding: 0 20px;
`
