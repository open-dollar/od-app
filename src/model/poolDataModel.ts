import { action, Action, Thunk, thunk } from 'easy-peasy'
import { fetchPoolData, PoolData } from '@opendollar/sdk'

export interface PoolDataModel {
    poolData: PoolData
    setPoolData: Action<PoolDataModel, PoolData>
    fetchPoolData: Thunk<PoolDataModel, { geb: any } | undefined>
}

const poolDataModel: PoolDataModel = {
    poolData: {} as PoolData,

    setPoolData: action((state, payload) => {
        state.poolData = payload
    }),

    fetchPoolData: thunk(async (actions, payload) => {
        const geb = payload?.geb
        if (geb) {
            try {
                const data = await fetchPoolData(geb)
                actions.setPoolData(data)
            } catch (error) {
                console.debug('Error fetching pool data:', error)
            }
        } else {
            console.debug('Geb is undefined')
        }
    }),
}

export default poolDataModel
