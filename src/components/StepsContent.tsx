import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Button from './Button'
import Stepper from './Stepper'

interface Props {
    title: string
    text: string
    stepNumber: number
    btnText: string
    handleClick: () => void
    isDisabled: boolean
    isLoading: boolean
    id: string
}

const StepsContent = ({ title, text, stepNumber, btnText, handleClick, isDisabled, isLoading, id }: Props) => {
    const { t } = useTranslation()
    const steps = [
        { title: 'Step 1', text: 'Connect Wallet' },
        { title: 'Step 2', text: 'Create Vault Facilitator' },
        { title: 'Step 3', text: 'Create a Vault' },
    ]

    const returnLottie = (step: number) => {
        switch (step) {
            case 0:
                return <img src={require('../assets/closed-vault.png')} alt="" />
            case 1:
                return <img src={require('../assets/wallet.png')} alt="" />
            case 2:
                return <img src={require('../assets/vault-facilitator.png')} alt="" />
            case 3:
                return <img src={require('../assets/opened-vault.png')} alt="" />
            default:
                return <img src={require('../assets/od-land.png')} alt="" />
        }
    }
    console.log({ stepNumber })
    stepNumber = 2
    return (
        <Container id={id}>
            {stepNumber > 0 && (
                <StepperWrapper>
                    <Stepper step={stepNumber} steps={steps} />
                </StepperWrapper>
            )}
            <ContentContainer stepNumber={stepNumber}>
                <ImageContainer stepNumber={stepNumber}>{returnLottie(stepNumber)}</ImageContainer>
                <ContentWrapper stepNumber={stepNumber}>
                    <Title>{t(title)}</Title>
                    <Text>{t(text)}</Text>
                    <Button
                        data-test-id="steps-btn"
                        id={stepNumber === 2 ? 'create-safe' : ''}
                        disabled={isDisabled || isLoading}
                        isLoading={isLoading}
                        text={t(btnText)}
                        onClick={handleClick}
                        secondary
                    />
                </ContentWrapper>
            </ContentContainer>
        </Container>
    )
}

export default StepsContent

const Container = styled.div`
    text-align: center;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const ImageContainer = styled.div<{ stepNumber: number }>`
    margin-right: ${(props) => (props.stepNumber === 0 ? '' : '30px')};
    max-width: ${(props) => (props.stepNumber === 0 ? '608px' : '319px')};

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
    max-width: 923px;
    align-items: center;

    @media (max-width: 960px) {
        flex-direction: column;
    }
`

const StepperWrapper = styled.div`
    padding-top: 22px;
    padding-bottom: 22px;
    padding-left: 34px;
    padding-right: 28px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0px 4px 6px 0px #0d4b9d33;
    width: 100%;
    margin-bottom: 105px;
`

const Title = styled.h2`
    /* font-size: ${(props) => props.theme.font.large}; */
    font-size: 60px;
    font-weight: 700;
    /* color: ${(props) => props.theme.colors.neutral}; */
    color: #1c293a;
    margin-bottom: 28px;
`

const Text = styled.p`
    /* font-size: ${(props) => props.theme.font.small}; */
    font-size: 28px;
    font-weight: 400px;
    /* color: ${(props) => props.theme.colors.secondary}; */
    color: #475662;
    margin-bottom: 28px;
    line-height: 38px;
    text-align: start;

    @media (max-width: 960px) {
        text-align: center;
    }
`
