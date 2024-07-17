import { useEffect, useState } from 'react'
import { isAddress } from '@ethersproject/address'
import styled from 'styled-components'
import { useStoreState, useStoreActions } from '~/store'
import { useActiveWeb3React } from '~/hooks'
import { useNavigate, useParams } from 'react-router-dom'
import useGeb from '~/hooks/useGeb'
import CreateVaultStep from '~/components/CreateVaultStep'
import VaultList from './VaultList'
import { COIN_TICKER } from '~/utils'
import { useTranslation } from 'react-i18next'
import Accounts from './Accounts'
import Loader from '~/components/Loader'

interface OnBoardingProps {
    className?: string
}

const OnBoarding = ({ className }: OnBoardingProps) => {
    const navigate = useNavigate()
    const { account, provider, chainId } = useActiveWeb3React()
    const geb = useGeb()
    const { t } = useTranslation()

    const [loading, setLoading] = useState(false)
    const { address } = useParams<{ address: string }>()
    const { connectWalletModel: connectWalletState, safeModel: safeState } = useStoreState((state) => state)
    const { safeModel: safeActions } = useStoreActions((state) => state)
    const { isWrongNetwork, isStepLoading } = connectWalletState

    useEffect(() => {
        if (chainId !== 421614 && chainId !== 42161 && chainId !== 10) return
        if ((!account && !address) || (address && !isAddress(address.toLowerCase())) || !provider || isWrongNetwork)
            return

        const fetchSafes = async () => {
            setLoading(true)
            try {
                await safeActions.fetchUserSafes({
                    address: address || (account as string),
                    geb,
                    tokensData: connectWalletState.tokensData,
                })
                setLoading(false)
            } catch (error) {
                console.debug('Error fetching safes:', error)
                setLoading(false)
            }
        }

        if (geb && connectWalletState.tokensData) fetchSafes()

        const interval = setInterval(fetchSafes, 3000)
        return () => clearInterval(interval)
    }, [account, address, isWrongNetwork, connectWalletState.tokensData, geb, provider, safeActions, chainId])

    const handleCreateSafe = () => {
        navigate('/vaults/create')
    }

    return (
        <Container id="app-page" className={className}>
            <Content>
                {safeState.safeCreated ? (
                    <>
                        <VaultList address={address} />
                        <CreateVaultStep
                            stepNumber={2}
                            id="step2"
                            title={'create_safe'}
                            text={t('create_safe_text', { coin_ticker: COIN_TICKER })}
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
