import { LiFiWidget, WidgetConfig } from '@lifi/widget'

const widgetConfig: WidgetConfig = {
    integrator: 'opendollar',
    variant: 'wide',
    subvariant: 'default',
    appearance: 'light',
    // theme: {
    //     palette: {
    //         primary: {
    //             main: '#1a74ec',
    //         },
    //         secondary: {
    //             main: '#6496ff',
    //         },
    //         common: {
    //             white: '#ffffff',
    //         },
    //         background: {
    //             paper: '#ffffff',
    //         },
    //         text: {
    //             primary: '#1c293a',
    //             secondary: '#56636e',
    //         },
    //         warning: {
    //             main: '#fcbf3c',
    //         },
    //         error: {
    //             main: '#eb7680',
    //         },
    //         info: {
    //             main: '#1b74ec',
    //         },
    //         success: {
    //             main: '#459d00',
    //         },
    //         grey: {
    //             200: '#ccd8e5',
    //             300: '#ccd8e5',
    //         },
    //     },
    //     typography: {
    //         fontFamily: 'Open Sans, sans-serif',
    //     },
    //     container: {
    //         boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
    //         borderRadius: '16px',
    //     },
    //     shape: {
    //         borderRadiusSecondary: 3,
    //         borderRadius: 3,
    //     },
    // },
    walletConfig: {
        async onConnect() {},
    },
}

const Widget = () => {
    return <LiFiWidget config={widgetConfig} integrator="opendollar" />
}

export default Widget
