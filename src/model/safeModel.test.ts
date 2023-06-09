import { createStore, EasyPeasyConfig, Store } from 'easy-peasy'
import safeModel, { SafeModel } from './safeModel'

const liquidationDataMock = {
    accumulatedRate: '1',
    currentPrice: {
        liquidationPrice: '123',
        safetyPrice: '123',
        value: '123',
    },
    debtCeiling: '1000',
    debtFloor: '500',
    liquidationCRatio: '1.45',
    liquidationPenalty: '1.12',
    safetyCRatio: '1.45',
    totalAnnualizedStabilityFee: '1',
    currentRedemptionPrice: '3',
    currentRedemptionRate: '1',
    globalDebt: '1000',
    globalDebtCeiling: '1000',
    perSafeDebtCeiling: '1000',
}

const listMock = [
    {
        id: '6',
        date: '1612881676',
        riskState: 3,
        collateral: '2',
        debt: '2',
        totalDebt: '2',
        availableDebt: '2',
        accumulatedRate: '1',
        collateralRatio: '2',
        currentRedemptionPrice: '3',
        internalCollateralBalance: '0',
        currentLiquidationPrice: '2',
        liquidationCRatio: '1.45',
        liquidationPenalty: '1.12',
        liquidationPrice: '123',
        totalAnnualizedStabilityFee: '1',
        currentRedemptionRate: '1',
    },
]

describe('safe model', () => {
    let store: Store<SafeModel, EasyPeasyConfig<{}, any>>
    beforeEach(() => {
        store = createStore(safeModel)
    })
    describe('setLiquidationData', () => {
        it('sets Liquidation Data', () => {
            store.getActions().setLiquidationData(liquidationDataMock)
            const liquidationData = store.getState().liquidationData
            expect(liquidationData).toBeTruthy()
            expect(liquidationData.currentPrice).toBeTruthy()
            expect(liquidationData.currentPrice.liquidationPrice).toEqual('123')
            expect(liquidationData.currentPrice.safetyPrice).toEqual('123')
            expect(liquidationData.currentPrice.value).toEqual('123')
            expect(liquidationData.accumulatedRate).toEqual('1')
            expect(liquidationData.debtCeiling).toEqual('1000')
            expect(liquidationData.debtFloor).toEqual('500')
            expect(liquidationData.liquidationCRatio).toEqual('1.45')
            expect(liquidationData.liquidationPenalty).toEqual('1.12')
            expect(liquidationData.safetyCRatio).toEqual('1.45')
            expect(liquidationData.totalAnnualizedStabilityFee).toEqual('1')
            expect(liquidationData.globalDebt).toEqual('1000')
            expect(liquidationData.globalDebtCeiling).toEqual('1000')
            expect(liquidationData.perSafeDebtCeiling).toEqual('1000')
        })
    })

    describe('setSafeList', () => {
        it('sets Safe List', () => {
            store.getActions().setList(listMock)
            store.getActions().setLiquidationData(liquidationDataMock)
            const list = store.getState().list
            const liquidationData = store.getState().liquidationData
            expect(list.length).toEqual(1)
            const safe = list[0]
            expect(safe).toBeTruthy()
            expect(safe.id).toEqual('6')
            expect(safe.date).toEqual('1612881676')
            expect(safe.riskState).toEqual(3)
            expect(safe.collateral).toEqual('2')
            expect(safe.debt).toEqual('2')
            expect(safe.totalDebt).toEqual('2')
            expect(safe.availableDebt).toEqual('2')
            expect(safe.collateralRatio).toEqual('2')
            expect(safe.internalCollateralBalance).toEqual('0')
            expect(safe.currentLiquidationPrice).toEqual('2')

            expect(safe.accumulatedRate).toEqual(
                liquidationData.accumulatedRate
            )
            expect(safe.accumulatedRate).toEqual(
                liquidationData.accumulatedRate
            )
            expect(safe.liquidationCRatio).toEqual(
                liquidationData.liquidationCRatio
            )
            expect(safe.liquidationPenalty).toEqual(
                liquidationData.liquidationPenalty
            )
            expect(safe.liquidationPrice).toEqual(
                liquidationData.currentPrice.liquidationPrice
            )
            expect(safe.totalAnnualizedStabilityFee).toEqual(
                liquidationData.totalAnnualizedStabilityFee
            )
            expect(safe.currentRedemptionRate).toEqual(
                liquidationData.currentRedemptionRate
            )
            expect(safe.currentRedemptionPrice).toEqual(
                liquidationData.currentRedemptionPrice
            )
        })
    })
})
