import { useCallback, useEffect, useRef } from 'react'
import { useStoreActions, useStoreState } from '~/store'
import useGeb from '~/hooks/useGeb'
import { AnalyticsData } from '@opendollar/sdk/lib/virtual/virtualAnalyticsData'

export default function useAnalyticsData(): AnalyticsData | undefined {
    const { analyticsModel: analyticsData } = useStoreState((state) => state)
    const { fetchAnalyticsData } = useStoreActions((actions) => actions.analyticsModel)
    const geb = useGeb()
    const intervalRef = useRef<NodeJS.Timeout>()

    const fetchData = useCallback(async () => {
        if (geb) {
            try {
                await fetchAnalyticsData({ geb })
            } catch (error) {
                console.debug('Failed to fetch analytics data', error)
            }
        }
    }, [geb, fetchAnalyticsData])

    useEffect(() => {
        fetchData()
        intervalRef.current = setInterval(fetchData, 15000)

        return () => {
            clearInterval(intervalRef.current)
        }
    }, [fetchData])

    useEffect(() => {
        if (!analyticsData) {
            fetchData()
        }
    }, [analyticsData, fetchData])

    return analyticsData.analyticsData
}
