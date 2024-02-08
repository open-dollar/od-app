import { action, Action } from 'easy-peasy'
import { NitroPoolDetails } from '@opendollar/sdk'

export interface DepositModel {
    nitroPoolDetails: { [symbol: string]: NitroPoolDetails }
    setNitroPoolDetails: Action<DepositModel, { [symbol: string]: NitroPoolDetails }>
}

const depositModel: DepositModel = {
    nitroPoolDetails: {},
    setNitroPoolDetails: action((state, nitroPoolDetails) => {
        state.nitroPoolDetails = nitroPoolDetails
    }),
}

export default depositModel
