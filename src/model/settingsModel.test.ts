import { createStore, EasyPeasyConfig, Store } from 'easy-peasy'
import settingsModel, { SettingsModel } from './settingsModel'

describe('safe model', () => {
    let store: Store<SettingsModel, EasyPeasyConfig<{}, any>>
    beforeEach(() => {
        store = createStore(settingsModel)
    })

    describe('setsBodyOverflow', () => {
        it('sets body overflow', () => {
            expect(store.getState().bodyOverflow).toBe(false)
            store.getActions().setBodyOverFlow(true)
            expect(store.getState().bodyOverflow).toBe(true)
        })
    })

    describe('BlocksBody', () => {
        it('blocks body', () => {
            expect(store.getState().blockBody).toBe(false)
            store.getActions().setBlockBody(true)
            expect(store.getState().blockBody).toBe(true)
        })
    })

    describe('setsRPCAdapter', () => {
        it('sets RPCAdapter', () => {
            expect(store.getState().isRPCAdapterOn).toBe(true)
            store.getActions().setIsRPCAdapterOn(false)
            expect(store.getState().isRPCAdapterOn).toBe(false)
        })
    })
})
