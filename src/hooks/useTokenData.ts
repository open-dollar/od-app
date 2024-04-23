import { useCallback, useEffect, useRef } from 'react'
import { useStoreActions, useStoreState } from '~/store'
import { useActiveWeb3React } from '~/hooks/useActiveWeb3React'
import useGeb from '~/hooks/useGeb'

/**
 * Fetches token data for the given account and geb instance. This hook will automatically fetch the data every 15 seconds and also fetch the data immediately on setup.
 * The data state is only updated if the fetched data is different from the last fetched data.
 */
export default function useTokenData() {
    const { connectWalletModel: connectWalletState } = useStoreState((state) => state)
    const { connectWalletModel: connectWalletActions } = useStoreActions((state) => state)
    const { account } = useActiveWeb3React()
    const geb = useGeb()
    const intervalRef = useRef<NodeJS.Timeout>()

    const fetchData = useCallback(async () => {
        if (account && geb) {
            try {
                connectWalletActions.fetchTokenData({ geb, user: account })
            } catch (error) {
                console.debug('Failed to fetch token data', error)
            }
        }
    }, [account, geb, connectWalletActions])

    useEffect(() => {
        fetchData()
        intervalRef.current = setInterval(fetchData, 15000)

        return () => {
            clearInterval(intervalRef.current)
        }
    }, [fetchData])

    useEffect(() => {
        if (connectWalletState?.forceUpdateTokens) {
            fetchData()
        }
    }, [connectWalletState?.forceUpdateTokens, fetchData])
}
