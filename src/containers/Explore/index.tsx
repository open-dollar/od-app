import React from 'react'
import { useStoreState } from '~/store'
import useAnalyticsData from '~/hooks/useAnalyticsData'
import ExplorePage from './ExplorePage'

const Explore: React.FC = () => {
    const { globalSafeModel } = useStoreState((state) => state)
    const analyticsData = useAnalyticsData()

    return (
        //@ts-ignore
        <ExplorePage globalSafes={globalSafeModel} analyticsData={analyticsData} />
    )
}

export default Explore
