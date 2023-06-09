import React, { Suspense, useEffect } from 'react'
import i18next from 'i18next'
import { Redirect, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { I18nextProvider } from 'react-i18next'
import ErrorBoundary from './ErrorBoundary'
import { useStoreState } from './store'
import { darkTheme } from './utils/themes/dark'
import { Theme } from './utils/interfaces'
import Safes from './containers/Safes'
import { initI18n } from './utils/i18n'
import GlobalStyle from './GlobalStyle'
import Shared from './containers/Shared'
import Web3ReactManager from './components/Web3ReactManager'
import SafeDetails from './containers/Safes/SafeDetails'

import Privacy from './containers/Privacy'
import Auctions from './containers/Auctions'
import GoogleTagManager from './components/Analytics/GoogleTagManager'
import { SHOW_AUCTIONS } from './utils/constants'
import SafeSaviour from './containers/Safes/Saviour/SafeSaviour'
import Staking from './containers/Earn/Staking'
import Incentives from './containers/Earn/Incentives'
import CreateSafe from './containers/Safes/CreateSafe'

// Toast css

declare module 'styled-components' {
    export interface DefaultTheme extends Theme {}
}

const App = () => {
    const { settingsModel: settingsState } = useStoreState((state) => state)

    const { lang, bodyOverflow } = settingsState

    useEffect(() => {
        initI18n(lang)
    }, [lang])

    return (
        <I18nextProvider i18n={i18next}>
            <ThemeProvider theme={darkTheme}>
                <GlobalStyle bodyOverflow={bodyOverflow} />
                <ErrorBoundary>
                    <Shared>
                        <Suspense fallback={null}>
                            <Route component={GoogleTagManager} />
                            <Web3ReactManager>
                                <Switch>
                                    {SHOW_AUCTIONS && SHOW_AUCTIONS === '1' ? (
                                        <Route
                                            exact
                                            strict
                                            component={Auctions}
                                            path={'/auctions/:auctionType?'}
                                        />
                                    ) : null}
                                    <Route
                                        exact
                                        strict
                                        component={Staking}
                                        path={'/earn/staking'}
                                    />
                                    <Route
                                        exact
                                        strict
                                        component={Privacy}
                                        path={'/privacy'}
                                    />
                                    <Route
                                        exact
                                        strict
                                        component={Incentives}
                                        path={'/earn/incentives'}
                                    />
                                    <Route
                                        exact
                                        strict
                                        component={CreateSafe}
                                        path={'/safes/create'}
                                    />
                                    <Route
                                        exact
                                        strict
                                        component={SafeDetails}
                                        path={'/safes/:id/deposit'}
                                    />
                                    <Route
                                        exact
                                        strict
                                        component={SafeDetails}
                                        path={'/safes/:id/withdraw'}
                                    />
                                    <Route
                                        exact
                                        strict
                                        component={SafeSaviour}
                                        path={'/safes/:id/saviour'}
                                    />
                                    <Route
                                        exact
                                        strict
                                        component={SafeSaviour}
                                        path={'/safes/:id/saviour'}
                                    />
                                    <Route
                                        exact
                                        component={SafeDetails}
                                        path={'/safes/:id'}
                                    />
                                    <Route
                                        exact
                                        strict
                                        component={Safes}
                                        path={'/:address'}
                                    />
                                    <Route
                                        exact
                                        strict
                                        component={Safes}
                                        path={'/'}
                                    />

                                    <Redirect from="*" to="/" />
                                </Switch>
                            </Web3ReactManager>
                        </Suspense>
                    </Shared>
                </ErrorBoundary>
            </ThemeProvider>
        </I18nextProvider>
    )
}

export default App
