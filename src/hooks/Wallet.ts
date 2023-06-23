import { NETWORK_ID } from '~/connectors'
import store from '~/store'

export function useEthBalance() {
    return store.getState().connectWalletModel.ethBalance[NETWORK_ID].toString()
}
