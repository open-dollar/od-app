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
    },
}

export { lightTheme }
