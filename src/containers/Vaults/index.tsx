import { useEffect } from 'react'
import { isAddress } from '@ethersproject/address'
import styled from 'styled-components'

import { useStoreState, useStoreActions } from '~/store'
import { useActiveWeb3React } from '~/hooks'
import { useHistory } from 'react-router-dom'
import useGeb from '~/hooks/useGeb'
import CreateVaultStep from '~/components/CreateVaultStep'
import VaultList from './VaultList'
import { COIN_TICKER } from '~/utils'
import { useTranslation } from 'react-i18next'
import Accounts from './Accounts'

const OnBoarding = ({ ...props }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const history = useHistory()
    const { account, provider, chainId } = useActiveWeb3React()
    const geb = useGeb()
    const { t } = useTranslation()
    const {
        connectWalletModel: connectWalletState,
        safeModel: safeState,
        popupsModel: popupsState,
    } = useStoreState((state) => state)
    const { safeModel: safeActions } = useStoreActions((state) => state)
    const { isWrongNetwork, isStepLoading } = connectWalletState
    const address: string = props.match.params.address ?? ''

    useEffect(() => {
        if (chainId !== 421614 && chainId !== 42161 && chainId !== 10) return
        if (
            (!account && !address) ||
            (address && !isAddress(address.toLowerCase())) ||
            !provider ||
            connectWalletState.isWrongNetwork
        )
            return

        async function fetchSafes() {
            try {
                await safeActions.fetchUserSafes({
                    address: address || (account as string),
                    geb,
                    tokensData: connectWalletState.tokensData,
                })
            } catch (error) {
                console.debug('Error fetching safes:', error)
            }
        }

        if (geb && connectWalletState.tokensData) {
            fetchSafes()
        }

        const ms = 3000
        const interval = setInterval(() => {
            if (
                (!account && !address) ||
                (address && !isAddress(address.toLowerCase())) ||
                !provider ||
                connectWalletState.isWrongNetwork
            )
                fetchSafes()
        }, ms)

        return () => clearInterval(interval)
    }, [
        account,
        address,
        connectWalletState.isWrongNetwork,
        connectWalletState.tokensData,
        geb,
        provider,
        safeActions,
        chainId,
    ])

    const handleCreateSafe = () => {
        history.push('/vaults/create')
    }

    return (
        <Container id="app-page">
            <button   onClick={() => {
    throw new Error("Sentry Test Error");
  }}>Break the world</button>
            <Content>
                {safeState.safeCreated ? (
                    <>
                        <VaultList address={address} />
                        <CreateVaultStep
                            stepNumber={2}
                            id="step2"
                            title={'create_safe'}
                            text={t('create_safe_text', {
                                coin_ticker: COIN_TICKER,
                            })}
                            btnText={'create_safe'}
                            handleClick={handleCreateSafe}
                            isDisabled={isWrongNetwork}
                            isLoading={isStepLoading}
                        />
                    </>
                ) : popupsState.isWaitingModalOpen ? null : (
                    <Accounts />
                )}
            </Content>
        </Container>
    )
}

export default OnBoarding

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Content = styled.div`
    position: relative;
    max-width: 1362px;
    width: 100%;
`
