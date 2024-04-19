import { useEffect, useRef, useState, useMemo } from 'react'
import { Geb } from '@opendollar/sdk'
import { useStoreActions } from '~/store'

/**
 * Fetches token data for the given account and geb instance. This hook will automatically fetch the data every 15 seconds and also fetch the data immediately on setup.
 * fetchTokenData is only called if the payload has changed or if forceUpdateTokens is true.
 * @param account
 * @param geb
 * @param forceUpdateTokens
 */
export default function useTokenData(account: string | undefined, geb: Geb | undefined, forceUpdateTokens: boolean) {
    const { connectWalletModel: connectWalletActions } = useStoreActions((state) => state)
    const intervalRef = useRef<NodeJS.Timeout>()
    const [lastFetchedData, setLastFetchedData] = useState(null)

    const fetchData = useMemo(() => {
        return () => {
            if (account && geb) {
                const tokenList = geb.tokenList
                const payload = { tokenList: tokenList, user: account }
                const newPayloadString = JSON.stringify(payload)
                if (newPayloadString !== lastFetchedData) {
                    connectWalletActions.fetchTokenData({ geb, user: account })
                    setLastFetchedData(newPayloadString as any)
                }
            }
        }
    }, [account, geb, lastFetchedData, connectWalletActions.fetchTokenData])

    useEffect(() => {
        intervalRef.current = setInterval(fetchData, 15000)
        fetchData()

        return () => {
            clearInterval(intervalRef.current)
        }
    }, [fetchData])

    useEffect(() => {
        if (forceUpdateTokens) {
            fetchData()
        }
    }, [forceUpdateTokens, fetchData])
}
