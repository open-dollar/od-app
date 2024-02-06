import { useEffect, useMemo, useCallback } from 'react'
import useGeb from './useGeb'
import { useStoreState, useStoreActions } from '~/store'
import { fetchNitroPoolODGWSTETH } from '@opendollar/sdk'
import { isEmptyObject } from '~/utils'

export const useNitroPool = () => {
    const geb = useGeb()

    const {
        depositModel: { depositTokens, nitroPoolDetails },
    } = useStoreState((state) => state)
    const {
        depositModel: { setNitroPoolDetails },
    } = useStoreActions((actions) => actions)

    const depositTokensData = useMemo(() => {
        if (!geb) return []

        return Object.keys(geb.tokenList)
            .filter((token) => depositTokens.has(token))
            .map((token) => geb.tokenList[token])
    }, [depositTokens, geb])

    const fetchPoolDetails = useCallback(async () => {
        if (!geb) return

        const fetchedNitroPoolDetails = await Promise.all(
            Array.from(depositTokensData).map(async ({ symbol, address }) => ({
                [symbol]: await fetchNitroPoolODGWSTETH(geb, address),
            }))
        )

        setNitroPoolDetails(Object.assign({}, ...fetchedNitroPoolDetails))
    }, [depositTokensData, geb, setNitroPoolDetails])

    useEffect(() => {
        if (!geb || !isEmptyObject(nitroPoolDetails)) {
            return
        }

        fetchPoolDetails()
    }, [depositTokensData, fetchPoolDetails, geb, nitroPoolDetails])

    return {
        poolDetails: nitroPoolDetails,
        depositTokens: depositTokensData,
        forceRefresh: fetchPoolDetails,
    }
}
