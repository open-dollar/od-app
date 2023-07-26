import i18next from 'i18next'
import { Suspense } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Redirect, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import ErrorBoundary from './ErrorBoundary'
import GlobalStyle from './GlobalStyle'
import Web3ReactManager from './components/Web3ReactManager'
import Safes from './containers/Safes'
import SafeDetails from './containers/Safes/SafeDetails'
import Shared from './containers/Shared'
import { useStoreState } from './store'
import { Theme } from './utils/interfaces'
import { darkTheme } from './utils/themes/dark'

import Splash from './containers/Splash'
import GoogleTagManager from './components/Analytics/GoogleTagManager'
import Privacy from './containers/Privacy'
import CreateSafe from './containers/Safes/CreateSafe'
import Auctions from './containers/Auctions'
import Analytics from './containers/Analytics'

declare module 'styled-components' {
    export interface DefaultTheme extends Theme {}
}

const App = () => {
    const { settingsModel: settingsState } = useStoreState((state) => state)

    const { bodyOverflow } = settingsState

    return (
        <I18nextProvider i18n={i18next}>
            <ThemeProvider theme={darkTheme}>
                <GlobalStyle bodyOverflow={bodyOverflow} />
                <ErrorBoundary>
                    <Shared>
                        <Suspense fallback={null}>
                            <Route component={GoogleTagManager} />
                            <Web3ReactManager>
                                <>
                                    <Switch>
                                        <Route exact strict component={Splash} path={'/'} />
                                        <Route exact strict component={Privacy} path={'/privacy'} />
                                        <Route exact strict component={Auctions} path={'/auctions'} />
                                        <Route exact strict component={Analytics} path={'/analytics'} />
                                        <Route exact strict component={CreateSafe} path={'/safes/create'} />
                                        <Route exact strict component={SafeDetails} path={'/safes/:id/deposit'} />
                                        <Route exact strict component={SafeDetails} path={'/safes/:id/withdraw'} />
                                        <Route exact component={SafeDetails} path={'/safes/:id'} />
                                        <Route exact strict component={Safes} path={'/safes'} />
                                        <Route exact strict component={Safes} path={'/:address'} />

                                        <Redirect from="*" to="/" />
                                    </Switch>
                                </>
                            </Web3ReactManager>
                        </Suspense>
                    </Shared>
                </ErrorBoundary>
            </ThemeProvider>
        </I18nextProvider>
    )
}

export default App
