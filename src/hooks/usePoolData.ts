import { useCallback, useEffect, useRef } from 'react'
import { useStoreActions, useStoreState } from '~/store'
import useGeb from '~/hooks/useGeb'
import { PoolData } from '@opendollar/sdk'

export default function usePoolData(): PoolData | undefined {
    const { poolDataModel: poolData } = useStoreState((state) => state)
    const { fetchPoolData } = useStoreActions((actions) => actions.poolDataModel)
    const geb = useGeb()
    const intervalRef = useRef<NodeJS.Timeout>()

    const fetchData = useCallback(async () => {
        if (geb) {
            try {
                await fetchPoolData({ geb })
            } catch (error) {
                console.debug('Failed to fetch pool data', error)
            }
        }
    }, [geb, fetchPoolData])

    useEffect(() => {
        fetchData()
        intervalRef.current = setInterval(fetchData, 15000)

        return () => {
            clearInterval(intervalRef.current)
        }
    }, [fetchData])

    useEffect(() => {
        if (!poolData) {
            fetchData()
        }
    }, [poolData, fetchData])

    return poolData.poolData
}
