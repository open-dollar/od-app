import { useCallback, useEffect, useMemo, useState } from 'react'
import { Geb } from '@opendollar/sdk'
import { IODSafeManager } from '@opendollar/sdk/lib/typechained'

import store, { useStoreActions, useStoreState } from '~/store'
import { EMPTY_ADDRESS, network_name } from '~/utils/constants'
import { formatNumber } from '~/utils/helper'
import { GebDeployment } from '@opendollar/sdk'
import { useActiveWeb3React } from '~/hooks'
import { NETWORK_ID } from '~/connectors'

type TokenType = 'ETH' | 'OD' | 'WETH'

// connect to @opendollar/sdk

export default function useGeb(): Geb {
    const { provider } = useActiveWeb3React()
    const [state, setState] = useState<Geb>()

    useEffect(() => {
        if (!provider) return
        const geb = new Geb(network_name() as GebDeployment, provider.getSigner())
        setState(geb)
    }, [provider])

    return state as Geb
}

// check if is owner of the safe
export function useIsOwner(safeId: string): boolean {
    const [state, setState] = useState(true)
    const geb = useGeb()
    const { account } = useActiveWeb3React()

    const getIsOwnerCallback = useCallback((res: [string, IODSafeManager.SAFEDataStructOutput]) => {
        if (res) {
            const [proxyAddress, { owner }] = res
            if (proxyAddress && owner) {
                setState(proxyAddress === owner)
            }
        }
    }, [])

    useEffect(() => {
        if (!geb || !account || !safeId) return undefined
        setState(true)
        Promise.all([
            geb.contracts.proxyRegistry.getProxy(account as string),
            geb.contracts.safeManager.safeData(safeId),
        ])
            .then(getIsOwnerCallback)
            .catch((error) => console.error(`Failed to get proxyAddress and SafeOwner`, error))
    }, [account, geb, getIsOwnerCallback, safeId])

    return state
}

// Returns proxy address from @opendollar/sdk
export function useProxyAddress() {
    const geb = useGeb()
    const { account } = useActiveWeb3React()
    const { connectWalletModel: connectWalletState } = useStoreState((state) => state)
    const { connectWalletModel: connectWalletActions } = useStoreActions((state) => state)
    const { proxyAddress } = connectWalletState

    useEffect(() => {
        if (!geb || !account || proxyAddress) return
        async function getProxyAddress() {
            try {
                const userProxy = await geb.getProxyAction(account as string)
                if (userProxy && userProxy.proxyAddress && userProxy.proxyAddress !== EMPTY_ADDRESS) {
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

// returns amount of currency in USD
export function useTokenBalanceInUSD(token: TokenType, balance: string, minDecimals = 2) {
    const ethPrice = store.getState().connectWalletModel.fiatPrice
    const haiPrice = store.getState().safeModel.liquidationData?.currentRedemptionPrice

    return useMemo(() => {
        const price = token === 'ETH' || token === 'WETH' ? ethPrice : haiPrice
        if (!balance) return '0'
        return formatNumber((Number(price) * Number(balance)).toString(), minDecimals)
    }, [token, ethPrice, haiPrice, balance, minDecimals])
}
