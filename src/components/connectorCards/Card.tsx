

// import { Accounts } from './Accounts'
// import { Chain } from './Chain'
import { ConnectWithSelect } from '../ConnectWithSelect'
// import { Status } from './Status'
import type { Connector } from '@web3-react/types'
import {MetaMask} from "@web3-react/metamask";
import {WalletConnect} from "@web3-react/walletconnect";
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'
import {CoinbaseWallet} from "@web3-react/coinbase-wallet";
import {Network} from "@web3-react/network";
import {Web3ReactHooks} from "@web3-react/core";

interface Props {
  connector: MetaMask | WalletConnect | WalletConnectV2 | CoinbaseWallet | Network
  activeChainId: ReturnType<Web3ReactHooks['useChainId']>
  chainIds?: ReturnType<Web3ReactHooks['useChainId']>[]
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>
  isActive: ReturnType<Web3ReactHooks['useIsActive']>
  error: Error | undefined
  setError: (error: Error | undefined) => void
  ENSNames: ReturnType<Web3ReactHooks['useENSNames']>
  provider?: ReturnType<Web3ReactHooks['useProvider']>
  accounts?: string[]
}

function getName(connector: Connector) {
    if (connector instanceof MetaMask) return 'MetaMask'
    if (connector instanceof WalletConnectV2) return 'WalletConnect V2'
    if (connector instanceof WalletConnect) return 'WalletConnect'
    if (connector instanceof CoinbaseWallet) return 'Coinbase Wallet'
    if (connector instanceof Network) return 'Network'
    return 'Unknown'
}

export function Card({
  connector,
  activeChainId,
  chainIds,
  isActivating,
  isActive,
  error,
  setError,
  ENSNames,
  accounts,
  provider,
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '20rem',
        padding: '1rem',
        margin: '1rem',
        overflow: 'auto',
        border: '1px solid',
        borderRadius: '1rem',
      }}
    >
      <b>{getName(connector)}</b>
      <div style={{ marginBottom: '1rem' }}>
        {/*<Status isActivating={isActivating} isActive={isActive} error={error} />*/}
      </div>
      {/*<Chain chainId={activeChainId} />*/}
      <div style={{ marginBottom: '1rem' }}>
        {/*<Accounts accounts={accounts} provider={provider} ENSNames={ENSNames} />*/}
      </div>
      <ConnectWithSelect
        connector={connector}
        activeChainId={activeChainId}
        chainIds={chainIds}
        isActivating={isActivating}
        isActive={isActive}
        error={error}
        setError={setError}
      />
    </div>
  )
}
