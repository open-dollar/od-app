import React, { useEffect } from 'react'
import i18next from 'i18next'
import { Suspense } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import ErrorBoundary from './ErrorBoundary'
import GlobalStyle from './GlobalStyle'
import Web3ReactManager from './components/Web3ReactManager'
import Safes from './containers/Vaults'
import VaultDetails from './containers/Vaults/VaultDetails'
import DepositFunds from './containers/Deposit/DepositFunds'
import Shared from './containers/Shared'
import Bridge from './containers/Bridge'
import { lightTheme } from './utils/themes/light'
import { StatsProvider } from './hooks/useStats'
import { ApolloProvider } from '@apollo/client'
import { client } from './utils/graph'
import CreateVault from './containers/Vaults/CreateVault'
import Auctions from './containers/Auctions'
import Analytics from './containers/Analytics'
import { ToastContainer } from 'react-toastify'
import PageNotFound from '~/containers/PageNotFound'
import Maintenance from '~/containers/Maintenance'
import MaintenanceRedirect from '~/containers/MaintenanceRedirect'
import GeoBlockContainer from './containers/GeoBlockContainer'
import * as Sentry from '@sentry/react'
import Earn from './containers/Earn'
import Bolts from './containers/Bolts'
import { Fuul } from '@fuul/sdk'
import EarnDetails from './containers/Earn/EarnDetails'
import Marketplace from './containers/Marketplace'
import LiFiWidget from './containers/Bridge/LiFiWidget'

Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost'],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    environment: process.env.NODE_ENV,
})

const network = process.env.REACT_APP_NETWORK_ID
const fuulApiKey = process.env.REACT_APP_FUUL_API_KEY
// Only initialize Fuul on Arbitrum One
if (network === '42161' && fuulApiKey) {
    try {
        Fuul.init({
            apiKey: fuulApiKey,
        })
        Fuul.sendPageview()
    } catch (e) {
        console.log(e)
    }
}

const App = () => {
    const location = useLocation()

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const referrer = params.get('referrer')
        const af = params.get('af')

        if (referrer || af) {
            localStorage.setItem('referralProgram', 'true')
        }
    }, [location.search])

    return (
        <I18nextProvider i18n={i18next}>
            <ThemeProvider theme={lightTheme}>
                <GlobalStyle />
                <ErrorBoundary>
                    <ToastContainer style={{ zIndex: 1001, position: 'sticky', top: 0, left: 0, width: '100%' }} />
                    <Shared>
                        <ApolloProvider client={client}>
                            <StatsProvider>
                                <Suspense fallback={null}>
                                    <Web3ReactManager>
                                        <MaintenanceRedirect>
                                            <Routes>
                                                <Route element={<PageNotFound />} path="/404" />
                                                <Route element={<Safes />} path={'/'} />
                                                <Route element={<Maintenance />} path={'/maintenance'} />
                                                <Route element={<Earn />} path={'/earn'} />
                                                <Route element={<Bolts />} path={'/bolts'} />
                                                <Route element={<Analytics />} path={'/stats'} />
                                                <Route
                                                    caseSensitive
                                                    element={<GeoBlockContainer />}
                                                    path={'/geoblock'}
                                                />
                                                <Route element={<Auctions />} path={'/auctions'} />
                                                <Route element={<Marketplace />} path={'/marketplace'} />
                                                <Route
                                                    caseSensitive
                                                    element={<CreateVault />}
                                                    path={'/vaults/create'}
                                                />
                                                <Route element={<Bridge />} path={'/bridge'} />
                                                <Route element={<LiFiWidget />} path={'/bridge/*'} />
                                                <Route
                                                    caseSensitive
                                                    element={<VaultDetails />}
                                                    path={'/vaults/:id/deposit'}
                                                />
                                                <Route element={<VaultDetails />} path={'/vaults/:id/withdraw'} />
                                                <Route element={<VaultDetails />} path={'/vaults/:id'} />
                                                <Route element={<EarnDetails />} path={'/earn/:id'} />
                                                <Route element={<Safes />} path={'/vaults'} />
                                                <Route element={<Safes />} path={'/:address'} />
                                                <Route element={<DepositFunds />} path={'/deposit/:token/deposit'} />
                                                <Route path="*" element={<PageNotFound />} />
                                            </Routes>
                                        </MaintenanceRedirect>
                                    </Web3ReactManager>
                                </Suspense>
                            </StatsProvider>
                        </ApolloProvider>
                    </Shared>
                </ErrorBoundary>
            </ThemeProvider>
        </I18nextProvider>
    )
}

export default App
