import { action, Action, thunk, Thunk } from 'easy-peasy'
import { StoreModel } from '~/model'
import { fetchGlobalSafes } from '~/services/safes'
import { timeout, ILiquidationData, ISafe, IFetchGlobalSafesPayload } from '~/utils'

export interface GlobalSafeModel {
    list: Array<ISafe>
    liquidationData: ILiquidationData | null
    fetchGlobalSafes: Thunk<GlobalSafeModel, IFetchGlobalSafesPayload, any, StoreModel>
    setList: Action<GlobalSafeModel, Array<ISafe>>
    setLiquidationData: Action<GlobalSafeModel, ILiquidationData>
}

const globalSafeModel: GlobalSafeModel = {
    list: [],
    liquidationData: null,
    fetchGlobalSafes: thunk(async (actions, payload) => {
        let fetched
        try {
            fetched = await fetchGlobalSafes(payload)
        } catch (e) {
            console.debug('Failed to fetch global safes', e)
        }
        if (fetched) {
            actions.setList(fetched.globalSafes)
            actions.setLiquidationData(fetched.liquidationData)
            await timeout(200)
            return fetched
        }
    }),
    setList: action((state, payload) => {
        state.list = payload
    }),
    setLiquidationData: action((state, payload) => {
        state.liquidationData = payload
    }),
}

export default globalSafeModel
