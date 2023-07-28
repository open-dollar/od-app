import { ReactNode, useEffect, useCallback } from 'react'
import { getTokenList } from '@hai-on-op/sdk/lib/contracts/addreses'
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
import WalletModal from '~/components/WalletModal'
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
} from '~/utils'
import LiquidateSafeModal from '~/components/Modals/LiquidateSafeModal'

interface Props {
    children: ReactNode
}

const Shared = ({ children, ...rest }: Props) => {
    const { t } = useTranslation()
    const { chainId, account, library } = useActiveWeb3React()
    const geb = useGeb()
    const history = useHistory()

    const previousAccount = usePrevious(account)

    const location = useLocation()
    const isSplash = location.pathname === '/'
    const tokensData = geb?.tokenList
    const coinTokenContract = useTokenContract(getTokenList(ETH_NETWORK).HAI.address)
    const protTokenContract = useTokenContract(getTokenList(ETH_NETWORK).KITE.address)

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
    const toastId = 'networdToastHash'
    const successAccountConnection = 'successAccountConnection'

    const resetModals = () => {
        popupsActions.setIsConnectedWalletModalOpen(false)
        popupsActions.setIsConnectModalOpen(false)
        popupsActions.setIsConnectorsWalletOpen(false)
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

    useEffect(() => {
        const haiBalance = connectWalletState?.tokensFetchedData.HAI?.balanceE18
        const kiteBalance = connectWalletState?.tokensFetchedData.KITE?.balanceE18

        if (haiBalance && kiteBalance) {
            setCoinBalances({
                hai: utils.formatEther(haiBalance),
                kite: utils.formatEther(kiteBalance),
            })
        }
    }, [connectWalletState, setCoinBalances])

    useEffect(() => {
        if (account && coinTokenContract && protTokenContract && connectWalletState.proxyAddress) {
            protTokenContract.allowance(account, connectWalletState.proxyAddress).then((allowance) => {
                const formattedAllowance = utils.formatEther(allowance)
                connectWalletActions.setProtAllowance(formattedAllowance)
            })

            coinTokenContract.allowance(account, connectWalletState.proxyAddress).then((allowance) => {
                const formattedAllowance = utils.formatEther(allowance)
                connectWalletActions.setCoinAllowance(formattedAllowance)
            })
        }
    }, [account, coinTokenContract, connectWalletActions, connectWalletState.proxyAddress, protTokenContract])

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

    useEffect(() => {
        connectWalletActions.fetchFiatPrice()
    }, [connectWalletActions])

    async function accountChecker() {
        if (!account || !chainId || !library || !geb) return
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
                if (pathname && pathname !== '/' && pathname !== '/safes') {
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

    function networkChecker() {
        accountChange()
        const id: ChainId = NETWORK_ID
        popupsActions.setIsSafeManagerOpen(false)
        if (chainId && chainId !== id) {
            const chainName = ETHERSCAN_PREFIXES[id]
            connectWalletActions.setIsWrongNetwork(true)
            // settingsActions.setBlockBody(true)
            toast(
                <ToastPayload
                    icon={'AlertTriangle'}
                    iconSize={40}
                    iconColor={'orange'}
                    textColor={'#272727'}
                    text={`${t('wrong_network')} ${capitalizeName(chainName === '' ? 'Mainnet' : chainName)}`}
                />,
                { autoClose: false, type: 'warning', toastId }
            )
        } else {
            toast.update(toastId, { autoClose: 1 })
            settingsActions.setBlockBody(false)
            connectWalletActions.setIsWrongNetwork(false)
            if (account) {
                toast(<ToastPayload icon={'Check'} iconColor={'green'} text={t('wallet_connected')} />, {
                    type: 'success',
                    toastId: successAccountConnection,
                })
                connectWalletActions.setStep(1)
                accountChecker()
            }
        }
    }
    /*eslint-disable-next-line*/
    const networkCheckerCallBack = useCallback(networkChecker, [account, chainId, geb])

    useEffect(() => {
        networkCheckerCallBack()
    }, [networkCheckerCallBack])

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
            {!isSplash && <WaitingModal />}
            <TopUpModal />
            {!isSplash && (
                <EmptyDiv>
                    <Navbar />
                </EmptyDiv>
            )}

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

const Content = styled.div``
const EmptyDiv = styled.div``

const AlertContainer = styled.div`
    padding: 0 20px;
`
