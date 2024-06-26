import { action, Action } from 'easy-peasy'

const language = localStorage.getItem('lang')
const isLight = localStorage.getItem('isLight')

export interface SettingsModel {
    isLightTheme: boolean
    lang: string
    blockBody: boolean
    setIsLightTheme: Action<SettingsModel, boolean>
    setLang: Action<SettingsModel, string>
    setBlockBody: Action<SettingsModel, boolean>
}

const settingsModel: SettingsModel = {
    isLightTheme: isLight ? JSON.parse(isLight) : true,
    lang: language || 'en',
    blockBody: false,
    setIsLightTheme: action((state, payload) => {
        state.isLightTheme = payload
        localStorage.setItem('isLight', JSON.stringify(payload))
    }),
    setLang: action((state, payload) => {
        state.lang = payload
        localStorage.setItem('lang', payload)
    }),
    setBlockBody: action((state, payload) => {
        state.blockBody = payload
    }),
}

export default settingsModel
