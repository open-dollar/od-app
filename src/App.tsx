import React from 'react'
import i18next from 'i18next'
import { Suspense } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Redirect, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import ErrorBoundary from './ErrorBoundary'
import GlobalStyle from './GlobalStyle'
import Web3ReactManager from './components/Web3ReactManager'
import Safes from './containers/Vaults'
import VaultDetails from './containers/Vaults/VaultDetails'
import DepositFunds from './containers/Deposit/DepositFunds'
import Shared from './containers/Shared'
import { useStoreState } from './store'
import { lightTheme } from './utils/themes/light'
import { StatsProvider } from './hooks/useStats'
import { ApolloProvider } from '@apollo/client'
import { client } from './utils/graph'
import GoogleTagManager from './components/Analytics/GoogleTagManager'
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

const App = () => {
    const { settingsModel: settingsState } = useStoreState((state) => state)
    const { bodyOverflow } = settingsState

    return (
        <I18nextProvider i18n={i18next}>
            <ThemeProvider theme={lightTheme}>
                <GlobalStyle bodyOverflow={bodyOverflow} />
                <ErrorBoundary>
                    <ToastContainer style={{ zIndex: 1001, position: 'sticky', top: 0, left: 0, width: '100%' }} />
                    <Shared>
                        <ApolloProvider client={client}>
                            <StatsProvider>
                                <Suspense fallback={null}>
                                    <Route component={GoogleTagManager} />
                                    <Web3ReactManager>
                                        <MaintenanceRedirect>
                                            <Switch>
                                                <Route exact strict component={PageNotFound} path="/404" />
                                                <Route exact strict component={Safes} path={'/'} />
                                                <Route exact strict component={Maintenance} path={'/maintenance'} />
                                                <Route exact strict component={Earn} path={'/earn'} />
                                                <Route exact strict component={Analytics} path={'/stats'} />
                                                <Route exact strict component={GeoBlockContainer} path={'/geoblock'} />
                                                <Route exact strict component={Auctions} path={'/auctions'} />
                                                <Route exact strict component={CreateVault} path={'/vaults/create'} />
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
