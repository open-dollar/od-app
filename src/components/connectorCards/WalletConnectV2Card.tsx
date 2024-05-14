import { URI_AVAILABLE } from '@web3-react/walletconnect-v2'
import { useEffect, useState } from 'react'
import { MAINNET_CHAINS } from '../../chains'
import { hooks, walletConnectV2 } from '../../connectors/walletConnectV2'
import { Card } from './Card'
import { useActiveWeb3React } from '~/hooks'
import { Network } from '@web3-react/network'

const CHAIN_IDS = Object.keys(MAINNET_CHAINS).map(Number)
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } = hooks

interface WalletConnectV2CardProps {
    error: Error | undefined
    setError: (error: Error | undefined) => void
}

export default function WalletConnectV2Card({ error, setError }: WalletConnectV2CardProps) {
    const [userInitiatedConnection, setUserInitiatedConnection] = useState(false)
    const chainId = useChainId()
    const accounts = useAccounts()
    const isActivating = useIsActivating()
    const isActive = useIsActive()
    const provider = useProvider()
    const { connector } = useActiveWeb3React()

    // attempt to connect eagerly on mount
    useEffect(() => {
        if (!(connector instanceof Network) && connector) {
            walletConnectV2.deactivate().catch(() => {})
        }
        walletConnectV2.connectEagerly().catch(() => {})
    }, [connector])

    // log URI when available
    useEffect(() => {
        walletConnectV2.events.on(URI_AVAILABLE, (uri: string) => {
            console.log(`uri: ${uri}`)
        })
    }, [])

    const handleUserInitiatedConnection = () => {
        setUserInitiatedConnection(true)
    }

    return (
        <Card
            userInitiatedConnection={userInitiatedConnection}
            onUserInitiatedConnection={handleUserInitiatedConnection}
            connector={walletConnectV2}
            activeChainId={chainId}
            chainIds={CHAIN_IDS}
            isActivating={isActivating}
            isActive={isActive}
            error={error}
            setError={setError}
            accounts={accounts}
            provider={provider}
        />
    )
}
