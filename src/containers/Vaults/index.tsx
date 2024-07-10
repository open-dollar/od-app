import { useEffect, useState } from 'react'
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
import Loader from '~/components/Loader'

const OnBoarding = ({ ...props }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const history = useHistory()
    const [loading, setLoading] = useState(false)
    const { account, provider, chainId } = useActiveWeb3React()
    const geb = useGeb()
    const { t } = useTranslation()
    const { connectWalletModel: connectWalletState, safeModel: safeState } = useStoreState((state) => state)
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
            console.log('Fetching safes')
            setLoading(true)
            // popupsModel.setIsWaitingModalOpen(true)
            try {
                await safeActions.fetchUserSafes({
                    address: address || (account as string),
                    geb,
                    tokensData: connectWalletState.tokensData,
                })
                console.log('Safes fetched SUCCESS')
                setLoading(false)
                // popupsModel.setIsWaitingModalOpen(false)
            } catch (error) {
                console.log('ERROR GETTING SAFES')
                console.debug('Error fetching safes:', error)
                setLoading(false)
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

    console.log('LOADING', loading)
    return (
        <Container id="app-page">
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
                ) : loading ? (
                    <LoaderWrapper>
                        <Loader width="200px" color="#1A74EC" />
                    </LoaderWrapper>
                ) : (
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

const LoaderWrapper = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`
