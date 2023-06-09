import { action, Action } from 'easy-peasy'
import { ILiquidityData, IStakedLP, IStakingData } from '../utils/interfaces'

export const farmersArray = ['volt', 'h2o'] as const
export const contractsArray = ['flx', 'flx_lp'] as const

export type FARMER_NAME = typeof farmersArray[number]
export type CONTRACT_NAME = typeof contractsArray[number]
export interface EarnModel {
    data: ILiquidityData
    stakedLP: IStakedLP
    stakingData: IStakingData
    amount: string
    farmerName: FARMER_NAME
    contractName: CONTRACT_NAME
    setData: Action<EarnModel, ILiquidityData>
    setStakedLP: Action<EarnModel, IStakedLP>
    setStakingData: Action<EarnModel, IStakingData>
    setAmount: Action<EarnModel, string>
    setFarmerName: Action<EarnModel, FARMER_NAME>
    setContractName: Action<EarnModel, CONTRACT_NAME>
}

const earnModel: EarnModel = {
    amount: '',
    farmerName: 'volt',
    contractName: 'flx',
    stakingData: {
        stFlxAmount: '',
        stakingAmount: '',
    },
    data: {
        ethAmount: '',
        raiAmount: '',
        totalLiquidity: '',
    },
    stakedLP: {
        eth: '',
        rai: '',
    },
    setData: action((state, payload) => {
        state.data = payload
    }),
    setStakedLP: action((state, payload) => {
        state.stakedLP = payload
    }),
    setStakingData: action((state, payload) => {
        state.stakingData = payload
    }),
    setAmount: action((state, payload) => {
        state.amount = payload
    }),
    setFarmerName: action((state, payload) => {
        state.farmerName = payload
    }),
    setContractName: action((state, payload) => {
        state.contractName = payload
    }),
}

export default earnModel
