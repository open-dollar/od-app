import { createStore, EasyPeasyConfig, Store } from 'easy-peasy'
import safeModel, { SafeModel } from './safeModel'

const liquidationDataMock = {
    currentRedemptionPrice: '3',
    currentRedemptionRate: '1',
    globalDebt: '1000',
    globalDebtCeiling: '1000',
    perSafeDebtCeiling: '1000',
    collateralLiquidationData: {
        WETH: {
            accumulatedRate: '1',
            currentPrice: {
                liquidationPrice: '123',
                safetyPrice: '123',
                value: '123',
            },
            debtFloor: '500',
            liquidationCRatio: '1.45',
            liquidationPenalty: '1.12',
            safetyCRatio: '1.45',
            totalAnnualizedStabilityFee: '1',
        },
    },
}

const listMock = [
    {
        id: '6',
        date: '1612881676',
        safeHandler: 'handler',
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
        collateralName: 'WETH',
        collateralType: 'WETH',
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
            expect(liquidationData!.collateralLiquidationData.WETH.currentPrice).toBeTruthy()
            expect(liquidationData!.collateralLiquidationData.WETH.currentPrice.liquidationPrice).toEqual('123')
            expect(liquidationData!.collateralLiquidationData.WETH.currentPrice.safetyPrice).toEqual('123')
            expect(liquidationData!.collateralLiquidationData.WETH.currentPrice.value).toEqual('123')
            expect(liquidationData!.collateralLiquidationData.WETH.accumulatedRate).toEqual('1')
            expect(liquidationData!.collateralLiquidationData.WETH.debtFloor).toEqual('500')
            expect(liquidationData!.collateralLiquidationData.WETH.liquidationCRatio).toEqual('1.45')
            expect(liquidationData!.collateralLiquidationData.WETH.liquidationPenalty).toEqual('1.12')
            expect(liquidationData!.collateralLiquidationData.WETH.safetyCRatio).toEqual('1.45')
            expect(liquidationData!.collateralLiquidationData.WETH.totalAnnualizedStabilityFee).toEqual('1')
            expect(liquidationData!.globalDebt).toEqual('1000')
            expect(liquidationData!.globalDebtCeiling).toEqual('1000')
            expect(liquidationData!.perSafeDebtCeiling).toEqual('1000')
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
            expect(safe.collateralName).toEqual('WETH')
            expect(safe.collateralType).toEqual('WETH')

            expect(safe.accumulatedRate).toEqual(liquidationData!.collateralLiquidationData.WETH.accumulatedRate)
            expect(safe.accumulatedRate).toEqual(liquidationData!.collateralLiquidationData.WETH.accumulatedRate)
            expect(safe.liquidationCRatio).toEqual(liquidationData!.collateralLiquidationData.WETH.liquidationCRatio)
            expect(safe.liquidationPenalty).toEqual(liquidationData!.collateralLiquidationData.WETH.liquidationPenalty)
            expect(safe.liquidationPrice).toEqual(
                liquidationData!.collateralLiquidationData.WETH.currentPrice.liquidationPrice
            )
            expect(safe.totalAnnualizedStabilityFee).toEqual(
                liquidationData!.collateralLiquidationData.WETH.totalAnnualizedStabilityFee
            )
            expect(safe.currentRedemptionRate).toEqual(liquidationData!.currentRedemptionRate)
            expect(safe.currentRedemptionPrice).toEqual(liquidationData!.currentRedemptionPrice)
        })
    })
})
