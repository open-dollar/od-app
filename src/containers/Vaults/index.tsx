import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useStoreState } from '~/store'
import { useNavigate, useParams } from 'react-router-dom'
import CreateVaultStep from '~/components/CreateVaultStep'
import VaultList from './VaultList'
import { COIN_TICKER } from '~/utils'
import { useTranslation } from 'react-i18next'
import Accounts from './Accounts'
import Loader from '~/components/Loader'
import useGeb from '~/hooks/useGeb'
import { useWeb3React } from '@web3-react/core'
import { Helmet } from 'react-helmet-async'

interface OnBoardingProps {
    className?: string
}

const OnBoarding = ({ className }: OnBoardingProps) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [loading, setLoading] = useState(true)
    const { address } = useParams<{ address: string }>()
    const { connectWalletModel: connectWalletState, safeModel: safeState } = useStoreState((state) => state)
    const { isWrongNetwork, isStepLoading } = connectWalletState
    const geb = useGeb()
    const { account } = useWeb3React()

    const handleCreateSafe = () => {
        navigate('/vaults/create')
    }

    useEffect(() => {
        if (geb && !account) {
            setLoading(false)
        } else if ((connectWalletState.tokensData && account) || geb) {
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }
    }, [loading, geb, connectWalletState.tokensData, account])

    return (
        <Container id="app-page" className={className}>
            <Helmet>
                <title>Open Dollar Dashboard - Manage Your Open Dollar Positions</title>
                <meta
                    name="description"
                    content="Access the Open Dollar Dashboard to manage your low-interest loans and tradable assets. Secure, efficient, and user-friendly DeFi platform for all your financial needs."
                />
                <meta
                    name="keywords"
                    content="Open Dollar dashboard, manage loans, low-interest loans, tradable assets, DeFi platform"
                />
            </Helmet>
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
                            isStepLoading={isStepLoading}
                        />
                    </>
                ) : loading || isStepLoading ? (
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
