import { useEffect, useCallback } from 'react'
import { useStoreActions } from '~/store'
import useGeb from '~/hooks/useGeb'
import usePrevious from '~/hooks/usePrevious'
import { useActiveWeb3React } from '~/hooks/useActiveWeb3React'

/**
 * A hook that manages fetching and updating user safes data. It performs the fetch
 * every minute if the conditions are met.
 */
export default function useSafeData() {
    const geb = useGeb()
    const tokensData = geb?.tokenList
    const { account } = useActiveWeb3React()
    const { safeModel: safeActions } = useStoreActions((state) => state)
    const previousAccount = usePrevious(account)

    const fetchUserSafes = useCallback(() => {
        if (account && geb && tokensData) {
            try {
                safeActions.fetchUserSafes({
                    address: account,
                    geb,
                    tokensData,
                })
            } catch (error) {
                console.debug('Failed to fetch user safes', error)
            }
        }
    }, [account, geb, tokensData, safeActions])

    // Fetch safes initially and on account or geb change
    useEffect(() => {
        fetchUserSafes()
        const interval = setInterval(fetchUserSafes, 60000)
        return () => clearInterval(interval)
    }, [fetchUserSafes])

    // Handles account changes
    useEffect(() => {
        if (account && previousAccount !== account) {
            fetchUserSafes()
        }
    }, [account, previousAccount, fetchUserSafes])
}
