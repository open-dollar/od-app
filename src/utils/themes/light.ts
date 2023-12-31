import { mediaWidthTemplates } from '../constants'
import { Theme } from '../interfaces'

const lightTheme: Theme = {
    colors: {
        primary: '#2A2A2A',
        secondary: '#A5A5A5',
        customSecondary: '#DADADA',
        gradient: 'linear-gradient(225deg, #78D8FF 0%, #4CE096 100%)',
        neutral: '#ffffff',
        background: '#040C20',
        overlay: 'rgba(0, 0, 0, 0.8)',
        greenish: '#2AC384',
        blueish: '#1499DA',
        border: '#08223E',
        yellowish: '#D9960A',
        foreground: '#05192e',
        dangerColor: '#e75966',
        dangerBackground: '#F8D7DA',
        dangerBorder: '#F5C6CB',
        alertColor: 'rgb(255,104,113)',
        alertBackground: '#CCE5FF',
        alertBorder: '#B8DAFF',
        successColor: '#155724',
        successBackground: '#D4EDDA',
        successBorder: '#C3E6CB',
        warningColor: '#856404',
        warningBackground: '#FFF3CD',
        warningBorder: '#856404',
        placeholder: '#031A31',
        inputBorderColor: '#6fbcdb',
        boxShadow: '#eef3f9',
        dimmedColor: '#ffffff',
        dimmedBackground: '#A4ABB7',
        dimmedBorder: '#878787',
        colorPrimary: '#002B40',
        colorSecondary: '031A31',
    },
    font: {
        extraSmall: '12px',
        small: '14px',
        default: '16px',
        medium: '18px',
        large: '20px',
        extraLarge: '22px',
    },
    global: {
        gridMaxWidth: '1500px',
        borderRadius: '4px',
        extraCurvedRadius: '20px',
        buttonPadding: '8px 16px',
        modalWidth: '720px',
    },
    mediaWidth: mediaWidthTemplates,
}

export { lightTheme }
