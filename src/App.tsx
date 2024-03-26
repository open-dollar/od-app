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
import { Theme } from './utils/interfaces'
import { darkTheme } from './utils/themes/dark'
import { lightTheme } from './utils/themes/light'
import { StatsProvider } from './hooks/useStats'

import { ApolloProvider } from '@apollo/client'
import { client } from './utils/graph'

import GoogleTagManager from './components/Analytics/GoogleTagManager'
import CreateVault from './containers/Vaults/CreateVault'
import Auctions from './containers/Auctions'

// Toast css
import Analytics from './containers/Analytics'
import { ToastContainer } from 'react-toastify'
import PageNotFound from '~/containers/PageNotFound'

declare module 'styled-components' {
    export interface DefaultTheme extends Theme {}
}

console.log(
    `%c🧙 Join the Open Dollar Team! ⚔️`,
    'color:blue;font-family:sans-serif;font-size:4rem;-webkit-text-stroke: 1px black;font-weight:bold'
)
console.log(
    `%cInquire about your next adventure in our Discord`,
    'font-family:sans-serif;font-size:1rem;font-weight:bold'
)

const App = () => {
    const { settingsModel: settingsState } = useStoreState((state) => state)

    const { bodyOverflow, isLightTheme } = settingsState

    const theme = isLightTheme ? lightTheme : darkTheme

    return (
        <I18nextProvider i18n={i18next}>
            <ThemeProvider theme={theme}>
                <GlobalStyle bodyOverflow={bodyOverflow} />
                <ErrorBoundary>
                    <ToastContainer style={{ zIndex: 1001, position: 'sticky', top: 0, left: 0, width: '100%' }} />
                    <Shared>
                        <ApolloProvider client={client}>
                            <StatsProvider>
                                <Suspense fallback={null}>
                                    <Route component={GoogleTagManager} />
                                    <Web3ReactManager>
                                        <>
                                            <Switch>
                                                <Route exact strict component={PageNotFound} path="/404" />
                                                <Route exact strict component={Safes} path={'/'} />
                                                <Route exact strict component={Analytics} path={'/stats'} />
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
                                        </>
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
