import { sharedTheme } from './shared'
import { Theme } from '../interfaces'

const darkTheme: Theme = {
    ...sharedTheme,
    // Currently same as light theme.
    // TODO: Implement dark theme once the design is read - 2024-03-18 @kai-thompson
    colors: {
        primary: '#1A74EC',
        secondary: '##E2F1FF',
        tertiary: '#475662',
        neutral: '#FFFFFF',
        background: '#E2F1FF',
        accent: '#1C293A',
        gradientBg: 'linear-gradient(180deg, #1A74EC 0%, #6396FF 100%);        ',
        error: 'red',
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

export { darkTheme }
