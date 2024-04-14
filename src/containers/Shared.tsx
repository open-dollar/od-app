import { ReactNode, useEffect, useCallback } from 'react'
import { GebDeployment, getTokenList } from '@opendollar/sdk/lib/contracts/addreses'
import { useHistory, useLocation } from 'react-router-dom'
import { isAddress } from '@ethersproject/address'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import { ethers, utils } from 'ethers'

import ConnectedWalletModal from '~/components/Modals/ConnectedWalletModal'
import BlockBodyContainer from '~/components/BlockBodyContainer'
import ApplicationUpdater from '~/services/ApplicationUpdater'
import { useActiveWeb3React, useTokenContract } from '~/hooks'
import TransactionUpdater from '~/services/TransactionUpdater'
import AuctionsModal from '~/components/Modals/AuctionsModal'
import TopUpModal from '~/components/Modals/SafeManagerModal'
import ScreenLoader from '~/components/Modals/ScreenLoader'
import WaitingModal from '~/components/Modals/WaitingModal'
import LoadingModal from '~/components/Modals/LoadingModal'
import MulticallUpdater from '~/services/MulticallUpdater'
import BlockedAddress from '~/components/BlockedAddress'
import { useStoreState, useStoreActions } from '~/store'
import ImagePreloader from '~/components/ImagePreloader'
import ProxyModal from '~/components/Modals/ProxyModal'
import BalanceUpdater from '~/services/BalanceUpdater'
import WethModal from '~/components/Modals/WETHModal'
import ToastPayload from '~/components/ToastPayload'
import CookieBanner from '~/components/CookieBanner'
import WalletModal, { checkAndSwitchMetamaskNetwork } from '~/components/WalletModal'
import AlertLabel from '~/components/AlertLabel'
import usePrevious from '~/hooks/usePrevious'
import SideMenu from '~/components/SideMenu'
import { NETWORK_ID } from '~/connectors'
import Navbar from '~/components/Navbar'
import useGeb from '~/hooks/useGeb'
import {
    ETHERSCAN_PREFIXES,
    blockedAddresses,
    capitalizeName,
    EMPTY_ADDRESS,
    SYSTEM_STATUS,
    timeout,
    ChainId,
    ETH_NETWORK,
    IS_IN_IFRAME,
} from '~/utils'
import LiquidateSafeModal from '~/components/Modals/LiquidateSafeModal'
import Footer from '~/components/Footer'
import checkSanctions from '~/services/checkSanctions'
import Stats from '~/containers/Vaults/Stats'
import axios from 'axios'

interface Props {
    children: ReactNode
}

const Shared = ({ children, ...rest }: Props) => {
    const { t } = useTranslation()
    const { chainId, account, provider, connector } = useActiveWeb3React()
    const geb = useGeb()
    const history = useHistory()

    const previousAccount = usePrevious(account)

    const location = useLocation()
    const { pathname } = location
    const isGeofenceEnabled = process.env.REACT_APP_GEOFENCE_ENABLED ?? false
    const tokensData = geb?.tokenList
    const coinTokenContract = useTokenContract(getTokenList(ETH_NETWORK as GebDeployment).OD.address)
    const protTokenContract = useTokenContract(getTokenList(ETH_NETWORK as GebDeployment).ODG.address)

    const {
        settingsModel: settingsState,
        connectWalletModel: connectWalletState,
        auctionModel: { auctionsData },
    } = useStoreState((state) => state)

    const {
        settingsModel: settingsActions,
        connectWalletModel: connectWalletActions,
        popupsModel: popupsActions,
        transactionsModel: transactionsActions,
        safeModel: safeActions,
        auctionModel: { setCoinBalances, setProtInternalBalance, setInternalBalance },
    } = useStoreActions((state) => state)
    const toastId = 'networkToastHash'
    const sanctionsToastId = 'sanctionsToastHash'
    const geoBlockToastId = 'geoBlockToastHash'

    const resetModals = () => {
        popupsActions.setIsConnectedWalletModalOpen(false)
        popupsActions.setIsConnectModalOpen(false)
        popupsActions.setIsLoadingModalOpen({ text: '', isOpen: false })
        popupsActions.setIsScreenModalOpen(false)
        popupsActions.setIsSettingModalOpen(false)
        popupsActions.setIsScreenModalOpen(false)
        popupsActions.setIsVotingModalOpen(false)
        popupsActions.setIsWaitingModalOpen(false)
        popupsActions.setShowSideMenu(false)
    }
    const forceUpdateTokens = connectWalletState.forceUpdateTokens

    useEffect(() => {
        if (account && geb && forceUpdateTokens) {
            connectWalletActions.fetchTokenData({ geb, user: account })
        }
    }, [account, geb, forceUpdateTokens, connectWalletActions])

    // Get latest token prices every 15 seconds
    useEffect(() => {
        const tokenDataInterval = setInterval(() => {
            if (account && geb) {
                connectWalletActions.fetchTokenData({ geb, user: account })
            }
        }, 15000)

        return () => clearInterval(tokenDataInterval)
    }, [account, geb, connectWalletActions])

    // Get latest vault data every 1 minute
    useEffect(() => {
        const statsInterval = setInterval(() => {
            if (account && geb && connectWalletState.tokensData) {
                safeActions.fetchUserSafes({
                    address: account as string,
                    geb,
                    tokensData: connectWalletState.tokensData,
                })
            }
        }, 60000)

        return () => clearInterval(statsInterval)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, geb, connectWalletActions])

    useEffect(() => {
        const odBalance = connectWalletState?.tokensFetchedData.OD?.balanceE18
        const odgBalance = connectWalletState?.tokensFetchedData.ODG?.balanceE18

        if (odBalance && odgBalance) {
            setCoinBalances({
                od: utils.formatEther(odBalance),
                odg: utils.formatEther(odgBalance),
            })
        }
    }, [connectWalletState, setCoinBalances])

    useEffect(() => {
        if (chainId !== NETWORK_ID) return
        if (account && coinTokenContract && protTokenContract && connectWalletState.proxyAddress) {
            protTokenContract.allowance(account, connectWalletState.proxyAddress).then((allowance) => {
                const formattedAllowance = utils.formatEther(allowance ?? 0)
                connectWalletActions.setProtAllowance(formattedAllowance)
            })

            coinTokenContract.allowance(account, connectWalletState.proxyAddress).then((allowance) => {
                const formattedAllowance = utils.formatEther(allowance ?? 0)
                connectWalletActions.setCoinAllowance(formattedAllowance)
            })
        }
    }, [account, coinTokenContract, connectWalletActions, connectWalletState.proxyAddress, protTokenContract, chainId])

    useEffect(() => {
        if (auctionsData) {
            const protInternalBalance = auctionsData.protocolTokenProxyBalance
            setProtInternalBalance(ethers.utils.formatEther(protInternalBalance))

            // coinTokenSafeBalance has 45 decimals
            const coinSafeBalance = auctionsData.coinTokenSafeBalance

            // const coinInternalBalance = coinBalance.add(coinSafeBalance)
            setInternalBalance(ethers.utils.formatUnits(coinSafeBalance, 45))
        }
    }, [auctionsData, setInternalBalance, setProtInternalBalance])

    useEffect(() => {
        connectWalletActions.setTokensData(tokensData)
    }, [connectWalletActions, tokensData])

    const fetchUserCountry = async () => {
        try {
            const response = await axios.get('https://api.country.is')
            return response.data?.country
        } catch (error) {
            console.error('Error fetching country:', error)
            return null
        }
    }

    const isUserGeoBlocked = async () => {
        if (!isGeofenceEnabled) {
            return false
        }

        const userCountry = await fetchUserCountry()
        return userCountry === 'US'
    }

    async function accountChecker() {
        if (!account || !chainId || !provider || !geb) return
        popupsActions.setWaitingPayload({
            title: '',
            status: 'loading',
        })
        popupsActions.setIsWaitingModalOpen(true)
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
        }

        await timeout(1000)
        popupsActions.setIsWaitingModalOpen(false)
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
            history.push('/')
            transactionsActions.setTransactions({})
        }
    }

    async function sanctionsCheck() {
        if (account && process.env.NODE_ENV === 'production') {
            const response = await checkSanctions(account)
            if (response?.identifications.length > 0) {
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
                return false
            } else {
                return true
            }
        }
        return true
    }

    async function geoBlockCheck() {
        if (account && isGeofenceEnabled) {
            const isBlocked = await isUserGeoBlocked()
            if (isBlocked) {
                connectWalletActions.setIsWrongNetwork(true)
                settingsActions.setBlockBody(true)
                toast(
                    <ToastPayload
                        icon={'AlertTriangle'}
                        iconSize={40}
                        iconColor={'orange'}
                        textColor={'#ffffff'}
                        text={`${t('geoblocked_wallet')}`}
                    />,
                    { autoClose: false, type: 'warning', toastId: geoBlockToastId }
                )
                return false
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
            sanctionsCheck()
            geoBlockCheck()
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
            toast.dismiss(toastId)
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
            checkAndSwitchMetamaskNetwork()
        }
    }, [chainId]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Container>
            {settingsState.blockBody ? <BlockBodyContainer /> : null}
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
            {pathname === '/' ? <Stats /> : <></>}
            <ImagePreloader />
            <EmptyDiv>
                <Footer />
            </EmptyDiv>
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
