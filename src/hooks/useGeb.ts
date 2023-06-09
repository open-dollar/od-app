import { Geb } from 'geb.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useActiveWeb3React } from '.'
import { NETWORK_ID } from '../connectors'
import store, { useStoreActions, useStoreState } from '../store'
import { EMPTY_ADDRESS, network_name } from '../utils/constants'
import { formatNumber } from '../utils/helper'

type TokenType = 'ETH' | 'RAI'

// connect to geb.js

export default function useGeb(): Geb {
    const { library } = useActiveWeb3React()
    const [state, setState] = useState<Geb>()

    useEffect(() => {
        if (!library) return
        const provider = library.getSigner().provider
        const geb = new Geb(network_name, provider)
        setState(geb)
    }, [library])

    return state as Geb
}

// check if is owner of the safe
export function useIsOwner(safeId: string): boolean {
    const [state, setState] = useState(true)
    const geb = useGeb()
    const { account } = useActiveWeb3React()

    const getIsOwnerCallback = useCallback((res) => {
        if (res) {
            const [proxyAddress, safeOwner] = res
            if (proxyAddress && safeOwner) {
                setState(proxyAddress === safeOwner)
            }
        }
    }, [])

    useEffect(() => {
        if (!geb || !account || !safeId) return undefined
        setState(true)
        geb.multiCall([
            geb.contracts.proxyRegistry.proxies(account as string, true),
            geb.contracts.safeManager.ownsSAFE(safeId, true),
        ])
            .then(getIsOwnerCallback)
            .catch((error) =>
                console.error(`Failed to get proxyAddress and SafeOwner`, error)
            )
    }, [account, geb, getIsOwnerCallback, safeId])

    return state
}

// Returns proxy address from geb.js
export function useProxyAddress() {
    const geb = useGeb()
    const { account } = useActiveWeb3React()
    const { connectWalletModel: connectWalletState } = useStoreState(
        (state) => state
    )
    const { connectWalletModel: connectWalletActions } = useStoreActions(
        (state) => state
    )
    const { proxyAddress } = connectWalletState

    useEffect(() => {
        if (!geb || !account || proxyAddress) return
        async function getProxyAddress() {
            try {
                const userProxy = await geb.getProxyAction(account as string)
                if (
                    userProxy &&
                    userProxy.proxyAddress &&
                    userProxy.proxyAddress !== EMPTY_ADDRESS
                ) {
                    connectWalletActions.setIsUserCreated(true)
                    connectWalletActions.setProxyAddress(userProxy.proxyAddress)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getProxyAddress()
    }, [account, connectWalletActions, geb, proxyAddress])

    return useMemo(() => proxyAddress, [proxyAddress])
}

// fetches latest blocknumber from store
export function useBlockNumber() {
    return store.getState().connectWalletModel.blockNumber[NETWORK_ID]
}

// returns safe handler from geb.js
export function useSafeHandler(safeId: string): string {
    const [state, setState] = useState('')
    const geb = useGeb()
    useEffect(() => {
        if (!geb || !safeId) return
        async function getSafeData() {
            const safeHandler = await geb.contracts.safeManager.safes(safeId)
            setState(safeHandler)
        }
        getSafeData()
    }, [geb, safeId])

    return state
}

// returns amount of currency in USD
export function useTokenBalanceInUSD(token: TokenType, balance: string) {
    const ethPrice = store.getState().connectWalletModel.fiatPrice
    const raiPrice =
        store.getState().safeModel.liquidationData.currentRedemptionPrice

    return useMemo(() => {
        const price = token === 'ETH' ? ethPrice : raiPrice
        if (!balance) return '0'
        return formatNumber((Number(price) * Number(balance)).toString(), 2)
    }, [token, ethPrice, raiPrice, balance])
}
