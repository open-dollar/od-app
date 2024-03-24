import { sharedTheme } from './shared'
import { Theme } from '../interfaces'

const lightTheme: Theme = {
    ...sharedTheme,
    colors: {
        primary: '#1A74EC',
        secondary: '#6396FF',
        tertiary: '#475662',
        neutral: '#FFFFFF',
        background: '#E2F1FF',
        accent: '#1C293A',
        gradient: '',
        overlay: '',
        border: '',
        foreground: '',
        dangerColor: '',
        dangerBackground: '',
        dangerBorder: '',
        alertColor: '',
        alertBackground: '',
        alertBorder: '',
        successColor: '',
        successBackground: '',
        successBorder: '',
        warningColor: '',
        warningBackground: '',
        warningBorder: '',
        placeholder: '',
        inputBorderColor: '',
        boxShadow: '',
        customSecondary: '',
        greenish: '',
        blueish: '',
        yellowish: '',
        dimmedColor: '',
        dimmedBackground: '',
        dimmedBorder: '',
        colorPrimary: '',
        colorSecondary: '',
    },
}

export { lightTheme }
