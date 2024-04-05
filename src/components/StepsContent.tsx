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
            case 1:
                return <img src={require('../assets/wallet.png')} alt="" />
            case 2:
                return <img src={require('../assets/od-vault.png')} alt="" />
            default:
                return <img src={require('../assets/od-land.png')} alt="" />
        }
    }

    return (
        <Container id={id}>
            <StepperWrapper>
                <Stepper step={stepNumber} steps={steps} />
            </StepperWrapper>
            <ContentContainer>
                <ImageContainer>{returnLottie(stepNumber)}</ImageContainer>
                <ContentWrapper>
                    <Title>{t(title)}</Title>
                    <Text>{t(text)}</Text>
                    <Button
                        data-test-id="steps-btn"
                        id={stepNumber === 2 ? 'create-safe' : ''}
                        disabled={isDisabled || isLoading}
                        isLoading={isLoading}
                        text={t(btnText)}
                        onClick={handleClick}
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

const ImageContainer = styled.div``

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const ContentContainer = styled.div`
    display: flex;
    max-width: 923px;
`

const StepperWrapper = styled.div`
    padding-top: 22px;
    padding-bottom: 22px;
    padding-left: 34px;
    padding-right: 28px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0px 4px 6px 0px #0d4b9d33;
    width: fit-content;
    margin-bottom: 105px;
`

const Title = styled.div`
    /* font-size: ${(props) => props.theme.font.large}; */
    font-size: 28px;
    font-weight: 600;
    /* color: ${(props) => props.theme.colors.neutral}; */
    color: #1c293a;
    margin-bottom: 10px;
`

const Text = styled.div`
    /* font-size: ${(props) => props.theme.font.small}; */
    font-size: 18px;
    text-align: start;
    /* color: ${(props) => props.theme.colors.secondary}; */
    color: #475662;
    margin-bottom: 20px;
    line-height: 21px;
    max-width: 550px;
`
