import type { Web3ReactHooks } from '@web3-react/core'
import {MetaMask} from "@web3-react/metamask";
import { Network } from '@web3-react/network'
import { WalletConnect } from '@web3-react/walletconnect'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'
import { useState } from 'react'

import {IconWrapper} from "~/components/ConnectedWalletIcon";
import {CoinbaseWallet} from "@web3-react/coinbase-wallet";

function getStatusIcon(connector: MetaMask | WalletConnect | WalletConnectV2 | CoinbaseWallet | Network) {
  if (connector instanceof MetaMask) {
    return (
        <IconWrapper size={32}>
          <img
              src={require('../assets/connectors/metamask.png')}
              alt={'metamask logo'}
          />
        </IconWrapper>
    )
  } else if (connector instanceof WalletConnectV2) {
    return (
        <IconWrapper size={32}>
          <img
              src={require('../assets/connectors/walletConnectIcon.svg').default}
              alt={'wallet connect logo'}
          />
        </IconWrapper>
    )
  } else if (connector instanceof CoinbaseWallet) {
    return (
        <IconWrapper size={32}>
          <img
              src={require('../assets/connectors/coinbaseWalletIcon.svg').default}
              alt={'coinbase wallet logo'}
          />
        </IconWrapper>
    )
  }
  return null
}

export function ConnectWithSelect({
  connector,
  activeChainId,
  isActivating,
  isActive,
  error,
  setError,
}: {
  connector: MetaMask | WalletConnect | WalletConnectV2 | CoinbaseWallet | Network
  activeChainId: ReturnType<Web3ReactHooks['useChainId']>
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>
  isActive: ReturnType<Web3ReactHooks['useIsActive']>
  error: Error | undefined
  setError: (error: Error | undefined) => void
}) {

  const [desiredChainId, setDesiredChainId] = useState<number>(parseInt(process.env.REACT_APP_NETWORK_ID || '-1', 10))

  return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ marginBottom: '1rem' }} />
        {isActive ? (
            error ? (
                <div>Try again?</div>
            ) : (
                <div
                    onClick={() => {
                      if (connector?.deactivate) {
                        void connector.deactivate();
                      } else {
                        void connector.resetState();
                      }
                      setDesiredChainId(-1);
                    }}
                >
                    { connector instanceof MetaMask ? '' : <>{'Disconnect'}</> }
                </div>
            )
        ) : (
            <div
            >
              {error ? 'Try again?' : getStatusIcon(connector)}
            </div>
        )}
      </div>
  );
}
