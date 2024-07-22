import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Button from './Button'
import vaultFacilitator from '../assets/vault-facilitator.webp'

interface Props {
    title: string
    text: string
    stepNumber: number
    btnText: string
    handleClick: () => void
    isDisabled: boolean
    isStepLoading: boolean
    id: string
}

const CreateVaultStep = ({ stepNumber, title, text, isDisabled, isStepLoading, btnText, handleClick }: Props) => {
    const { t } = useTranslation()
    return (
        <ContentContainer stepNumber={stepNumber}>
            <ImageContainer stepNumber={stepNumber}>
                <img src={vaultFacilitator} alt="" />
            </ImageContainer>
            <ContentWrapper stepNumber={stepNumber}>
                <Title>{t(title)}</Title>
                <Text>{t(text)}</Text>
                <Button
                    data-test-id="steps-btn"
                    id={stepNumber === 2 ? 'create-safe' : ''}
                    disabled={isDisabled || isStepLoading}
                    isLoading={isStepLoading}
                    text={t(btnText)}
                    onClick={handleClick}
                    secondary
                />
            </ContentWrapper>
        </ContentContainer>
    )
}

export default CreateVaultStep

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
