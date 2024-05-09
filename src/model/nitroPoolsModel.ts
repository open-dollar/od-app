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
        state.nitroPools = payload
    }),
    fetchNitroPool: thunk(async (state, payload) => {
        const geb = payload.geb
        let fetched
        try {
            fetched = await fetchNitroPool(
                geb,
                payload.poolAddress,
                payload.userAddress ?? '0x0000000000000000000000000000000000000000'
            )
        } catch (e) {
            console.debug('Error fetching nitropools data', e)
        }
        if (fetched) {
            state.setNitroPools([fetched])
        }
    }),
}

export default nitroPoolsModel
