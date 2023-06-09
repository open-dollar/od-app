import { createTypedHooks, createStore } from 'easy-peasy'
import model, { StoreModel } from './model'
import { initI18n } from './utils/i18n'

const store = createStore(model)

const typedHooks = createTypedHooks<StoreModel>()

export const useStoreActions = typedHooks.useStoreActions
export const useStoreDispatch = typedHooks.useStoreDispatch
export const useStoreState = typedHooks.useStoreState

initI18n(store.getState().settingsModel.lang)

export default store
