import { action, Action } from "easy-peasy"
import { NitroPoolDetails } from "@opendollar/sdk"

export interface DepositModel {
    depositTokens: Set<string>
    nitroPoolDetails: { [symbol: string]: NitroPoolDetails }
    setNitroPoolDetails: Action<DepositModel, { [symbol: string]: NitroPoolDetails }>
}

const depositModel: DepositModel = {
    depositTokens: new Set(['RETH', 'WSTETH']),
    nitroPoolDetails: {},
    setNitroPoolDetails: action((state, nitroPoolDetails) => {
        state.nitroPoolDetails = nitroPoolDetails
    }),
}

export default depositModel