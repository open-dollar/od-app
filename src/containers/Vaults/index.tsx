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
                <title>Open Dollar - Low-Interest DeFi Loans & Tradable CDPs</title>
                <title>Open Dollar - Low-Interest DeFi Loans & Tradable CDPs</title>
                <meta
                    name="description"
                    content="Discover Open Dollar, a DeFi platform offering low-interest tradable onchain loans. Secure and trade your collateral with ease. The future of onchain lending is here."
                />
                <meta
                    name="keywords"
                    content="Open Dollar, DeFi, low-interest loans, tradable assets, decentralized finance, collateral, stablecoins, tradeable CDPs"
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
