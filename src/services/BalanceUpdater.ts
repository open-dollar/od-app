import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../hooks'
import useDebounce from '../hooks/useDebounce'
import store, { useStoreState } from '../store'

export default function ApplicationUpdater(): null {
    const { provider, chainId, account } = useActiveWeb3React()
    const { connectWalletModel: connectedWalletState } = useStoreState((state) => state)
    const { blockNumber } = connectedWalletState

    const [state, setState] = useState<{
        chainId: number | undefined
        balance: number
    }>({
        chainId,
        balance: 0,
    })

    const fetchEthBalanceCallBack = useCallback(
        (result: any) => {
            setState((state) => {
                if (chainId === state.chainId) {
                    return {
                        chainId,
                        balance: Number(ethers.utils.formatEther(result)),
                    }
                }
                return state
            })
        },
        [chainId, setState]
    )

    // attach/detach listeners
    useEffect(() => {
        if (!chainId || !account) return undefined
        setState({ chainId, balance: 0 })
        // @ts-ignore
        provider
            .getBalance(account)
            .then(fetchEthBalanceCallBack)
            .catch((error) => console.error(`Failed to fetch balance for chainId: ${chainId}`, error))
    }, [chainId, provider, fetchEthBalanceCallBack, account, blockNumber])

    const debouncedState = useDebounce(state, 100)

    useEffect(() => {
        if (!debouncedState.chainId || !debouncedState.balance) return
        store.dispatch.connectWalletModel.updateEthBalance({
            chainId: debouncedState.chainId,
            balance: debouncedState.balance,
        })
    }, [debouncedState.balance, debouncedState.chainId])

    return null
}
