import { action, Action, Thunk, thunk } from 'easy-peasy'
import { IFetchNitroPool } from '~/utils'
import { fetchNitroPool } from '@opendollar/sdk'

export interface NitroPoolsModel {
    nitroPools: Array<any>
    setNitroPools: Action<NitroPoolsModel, any[]>
    fetchNitroPool: Thunk<NitroPoolsModel, IFetchNitroPool>
}

const nitroPoolsModel: NitroPoolsModel = {
    nitroPools: [],
    setNitroPools: action((state, payload) => {
        state.nitroPools = [...state.nitroPools, ...payload]
    }),
    fetchNitroPool: thunk(async (actions, payload) => {
        const geb = payload.geb
        let fetched
        try {
            fetched = await fetchNitroPool(
                payload.userAddress ?? '0x0000000000000000000000000000000000000000',
                payload.camelotPoolAddress,
                payload.nitroPoolAddress,
                geb.provider
            )
        } catch (e) {
            console.debug('Error fetching nitropools data', e)
        }
        if (fetched) {
            actions.setNitroPools([fetched])
        }
    }),
}

export default nitroPoolsModel
