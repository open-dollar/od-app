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
import Shared from './containers/Shared'
import { useStoreState } from './store'
import { Theme } from './utils/interfaces'
import { darkTheme } from './utils/themes/dark'
import { StatsProvider } from './hooks/useStats'

import { ApolloProvider } from '@apollo/client'
import { client } from './utils/graph'

import GoogleTagManager from './components/Analytics/GoogleTagManager'
import Privacy from './containers/Privacy'
import CreateVault from './containers/Vaults/CreateVault'
import Auctions from './containers/Auctions'
import './devlink/global.css'
import { DevLinkProvider } from './devlink'

// Toast css

declare module 'styled-components' {
    export interface DefaultTheme extends Theme {}
}

const App = () => {
    const { settingsModel: settingsState } = useStoreState((state) => state)

    const { bodyOverflow } = settingsState

    return (
        <I18nextProvider i18n={i18next}>
            <ThemeProvider theme={darkTheme}>
                <DevLinkProvider>
                    <GlobalStyle bodyOverflow={bodyOverflow} />
                    <ErrorBoundary>
                        <Shared>
                            <ApolloProvider client={client}>
                                <StatsProvider>
                                    <Suspense fallback={null}>
                                        <Route component={GoogleTagManager} />
                                        <Web3ReactManager>
                                            <>
                                                <Switch>
                                                    <Route exact strict component={Safes} path={'/'} />
                                                    <Route exact strict component={Privacy} path={'/privacy'} />
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

                                                    <Redirect from="*" to="/" />
                                                </Switch>
                                            </>
                                        </Web3ReactManager>
                                    </Suspense>
                                </StatsProvider>
                            </ApolloProvider>
                        </Shared>
                    </ErrorBoundary>
                </DevLinkProvider>
            </ThemeProvider>
        </I18nextProvider>
    )
}

export default App
