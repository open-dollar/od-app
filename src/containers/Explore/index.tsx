import React from 'react'
import useAnalyticsData from '~/hooks/useAnalyticsData'
import ExplorePage from './ExplorePage'
import { useVaultSubgraph } from '~/hooks/useVaultSubgraph'

const Explore: React.FC = () => {
    const allVaults = useVaultSubgraph()
    const analyticsData = useAnalyticsData()

    return <ExplorePage globalSafes={allVaults} analyticsData={analyticsData} />
}

export default Explore
