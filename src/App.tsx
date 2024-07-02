import React, { useEffect, lazy, Suspense } from 'react'
import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
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
import GoogleTagManager from './components/Analytics/GoogleTagManager'
import CreateVault from './containers/Vaults/CreateVault'
import Auctions from './containers/Auctions'
import Analytics from './containers/Analytics'
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
import ScreenLoader from '~/components/Modals/ScreenLoader'
import 'react-loading-skeleton/dist/skeleton.css'

const ToastContainer = lazy(() => import('react-toastify').then((module) => ({ default: module.ToastContainer })))

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
                    <Suspense fallback={<ScreenLoader />}>
                        <Shared>
                            <ApolloProvider client={client}>
                                <StatsProvider>
                                    <ToastContainer
                                        style={{ zIndex: 1001, position: 'sticky', top: 0, left: 0, width: '100%' }}
                                    />
                                    <Route component={GoogleTagManager} />
                                    <Web3ReactManager>
                                        <MaintenanceRedirect>
                                            <Switch>
                                                <Route exact strict component={PageNotFound} path="/404" />
                                                <Route exact strict component={Safes} path={'/'} />
                                                <Route exact strict component={Maintenance} path={'/maintenance'} />
                                                <Route exact strict component={Earn} path={'/earn'} />
                                                <Route exact strict component={Bolts} path={'/bolts'} />
                                                <Route exact strict component={Analytics} path={'/stats'} />
                                                <Route exact strict component={GeoBlockContainer} path={'/geoblock'} />
                                                <Route exact strict component={Auctions} path={'/auctions'} />
                                                <Route exact strict component={Marketplace} path={'/marketplace'} />
                                                <Route exact strict component={CreateVault} path={'/vaults/create'} />
                                                <Route exact strict component={Bridge} path={'/bridge'} />
                                                <Route
                                                    exact
                                                    strict
                                                    component={VaultDetails}
                                                    path={'/vaults/:id/deposit'}
                                                />
                                                <Route
                                                    exact
                                                    strict
                                                    component={VaultDetails}
                                                    path={'/vaults/:id/withdraw'}
                                                />
                                                <Route exact component={VaultDetails} path={'/vaults/:id'} />
                                                <Route exact component={EarnDetails} path={'/earn/:id'} />
                                                <Route exact strict component={Safes} path={'/vaults'} />
                                                <Route exact strict component={Safes} path={'/:address'} />
                                                <Route
                                                    exact
                                                    strict
                                                    component={DepositFunds}
                                                    path={'/deposit/:token/deposit'}
                                                />
                                                <Redirect path="*" to="/404" />
                                            </Switch>
                                        </MaintenanceRedirect>
                                    </Web3ReactManager>
                                </StatsProvider>
                            </ApolloProvider>
                        </Shared>
                    </Suspense>
                </ErrorBoundary>
            </ThemeProvider>
        </I18nextProvider>
    )
}

export default App
