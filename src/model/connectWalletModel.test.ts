import { createStore, EasyPeasyConfig, Store } from 'easy-peasy'
import connectWalletModel, { ConnectWalletModel } from './connectWalletModel'

describe('safe model', () => {
    let store: Store<ConnectWalletModel, EasyPeasyConfig<{}, any>>
    beforeEach(() => {
        store = createStore(connectWalletModel)
    })

    describe('setsBlockNumber', () => {
        it('sets block number', () => {
            store
                .getActions()
                .updateBlockNumber({ chainId: 42, blockNumber: 123 })
            expect(store.getState().blockNumber).toEqual({ 42: 123 })
        })
    })

    describe('setsEthBalance', () => {
        it('sets ethBalance', () => {
            store.getActions().updateEthBalance({ chainId: 42, balance: 123 })
            expect(store.getState().ethBalance).toEqual({ 1: 0, 42: 123 })
        })
    })

    describe('setsEthBalance', () => {
        it('sets raiBalance for mainnet', () => {
            store.getActions().updateEthBalance({ chainId: 1, balance: 123 })
            expect(store.getState().ethBalance).toEqual({ 1: 123, 42: 0 })
        })

        it('sets raiBalance for rinkeby', () => {
            store.getActions().updateEthBalance({ chainId: 4, balance: 123 })
            expect(store.getState().ethBalance).toEqual({ 1: 0, 42: 0, 4: 123 })
        })
    })
})
