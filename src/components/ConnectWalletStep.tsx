import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useStoreActions } from '~/store'
import Button from './Button'

const ConnectWalletStep = () => {
    const { popupsModel: popupsActions } = useStoreActions((state) => state)
    const handleConnectWallet = () => popupsActions.setIsConnectorsWalletOpen(true)

    const { t } = useTranslation()
    return (
        <ContentContainer stepNumber={0}>
            <ImageContainer stepNumber={0}>
                <img src={require('../assets/closed-vault.png')} alt="" />
            </ImageContainer>
            <ContentWrapper stepNumber={0}>
                <Title>{t('getting_started')}</Title>
                <Text>{t('getting_started_text')}</Text>
                <Button
                    data-test-id="connect-btn"
                    id={'connect-wallet-btn'}
                    text={t('connect_wallet')}
                    onClick={handleConnectWallet}
                    secondary
                />
            </ContentWrapper>
        </ContentContainer>
    )
}

export default ConnectWalletStep

const ImageContainer = styled.div<{ stepNumber: number }>`
    margin-right: ${(props) => (props.stepNumber === 0 ? '' : '30px')};
    max-width: ${(props) => (props.stepNumber === 0 ? '358px' : '319px')};

    @media (max-width: 960px) {
        margin-right: 0;
    }
`

const ContentWrapper = styled.div<{ stepNumber: number }>`
    display: flex;
    flex-direction: column;
    align-items: ${(props) => (props.stepNumber === 0 ? 'center' : 'flex-start')};

    @media (max-width: 960px) {
        align-items: center;
    }
`

const ContentContainer = styled.div<{ stepNumber: number }>`
    display: flex;
    flex-direction: ${(props) => (props.stepNumber === 0 ? 'column' : 'row')};
    justify-content: center;
    max-width: 100%;
    align-items: center;
    padding: 1em;
    @media (max-width: 960px) {
        flex-direction: column;
    }
`

const Title = styled.h2`
    font-size: 40px;
    font-weight: 700;
    color: #1c293a;
    margin-bottom: 28px;
`

const Text = styled.p`
    font-size: 18px;
    font-weight: 400;
    color: #475662;
    margin-bottom: 28px;
    line-height: 38px;
    text-align: start;

    @media (max-width: 960px) {
        text-align: center;
    }
`
