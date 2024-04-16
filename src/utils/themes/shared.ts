import { mediaWidthTemplates } from '../constants'
import { SharedTheme } from '../interfaces'

const sharedTheme: SharedTheme = {
    font: {
        xxSmall: '14px',
        xSmall: '16px',
        default: '18px',
        small: '20px',
        medium: '22px',
        large: '28px',
        xLarge: '32px',
        xxLarge: '60px',
    },
    family: {
        headers: 'Barlow, sans-serif',
        default: 'Open Sans, serif',
    },
    global: {
        gridMaxWidth: '1454px',
        borderRadius: '4px',
        extraCurvedRadius: '20px',
        buttonPadding: '8px 16px',
        modalWidth: '720px',
    },
    mediaWidth: mediaWidthTemplates,
}

export { sharedTheme }
