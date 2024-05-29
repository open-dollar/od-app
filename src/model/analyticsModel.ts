import { action, Action, Thunk, thunk } from 'easy-peasy'
import { AnalyticsData, fetchAnalyticsData } from '@opendollar/sdk/lib/virtual/virtualAnalyticsData'

export interface AnalyticsModel {
    analyticsData: AnalyticsData
    setAnalyticsData: Action<AnalyticsModel, AnalyticsData>
    fetchAnalyticsData: Thunk<AnalyticsModel, { geb: any } | undefined>
}

const analyticsModel: AnalyticsModel = {
    analyticsData: {} as AnalyticsData,

    setAnalyticsData: action((state, payload) => {
        state.analyticsData = payload
    }),

    fetchAnalyticsData: thunk(async (actions, payload) => {
        const geb = payload?.geb
        if (geb) {
            try {
                const data = await fetchAnalyticsData(geb)
                actions.setAnalyticsData(data)
            } catch (error) {
                console.debug('Error fetching analytics data:', error)
            }
        } else {
            console.debug('Geb is undefined')
        }
    }),
}

export default analyticsModel
