import { createStore, EasyPeasyConfig, Store } from 'easy-peasy'
import settingsModel, { SettingsModel } from './settingsModel'

describe('safe model', () => {
    let store: Store<SettingsModel, EasyPeasyConfig<{}, any>>
    beforeEach(() => {
        store = createStore(settingsModel)
    })

    describe('BlocksBody', () => {
        it('blocks body', () => {
            expect(store.getState().blockBody).toBe(false)
            store.getActions().setBlockBody(true)
            expect(store.getState().blockBody).toBe(true)
        })
    })
})
