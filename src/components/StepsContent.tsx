import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useState, useEffect } from 'react'
import Button from './Button'
import closedVault from '../assets/closed-vault.webp'
import wallet from '../assets/wallet.webp'
import vaultFacilitator from '../assets/vault-facilitator.webp'
import openedVault from '../assets/opened-vault.webp'
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

    const useReturnLottie = (step: number) => {
        const [loaded, setLoaded] = useState(false)

        useEffect(() => {
            // Fallback to load image
            const timer = setTimeout(() => {
                setLoaded(true)
            }, 3000)

            return () => clearTimeout(timer)
        }, [step])

        const handleImageLoad = () => {
            setLoaded(true)
        }

        const imageSrc = [closedVault, wallet, vaultFacilitator, openedVault][step] || closedVault

        useEffect(() => {
            setLoaded(false)
        }, [step])

        return (
            <div>
                {!loaded && <Skeleton baseColor={'rgb(220 241 255)'} width="100%" height="330px" />}
                <img
                    src={imageSrc}
                    alt=""
                    width="100%"
                    height="330px"
                    loading="lazy"
                    onLoad={handleImageLoad}
                    style={{ display: loaded ? 'block' : 'none' }}
                />
            </div>
        )
    }

    return (
        <Container id={id}>
            <StepperWrapper stepNumber={stepNumber}>
                <Stepper step={stepNumber} steps={steps} />
            </StepperWrapper>
            <ContentContainer stepNumber={stepNumber}>
                <ImageContainer stepNumber={stepNumber}>{useReturnLottie(stepNumber)}</ImageContainer>
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
    max-width: ${(props) => (props.stepNumber === 0 ? '358px' : '319px')};
    width: 358px;

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
    align-items: center;

    @media (max-width: 960px) {
        flex-direction: column;
    }
`

const StepperWrapper = styled.div<{ stepNumber: number }>`
    padding: 22px 28px 22px 34px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0px 4px 6px 0px #0d4b9d33;
    width: 100%;
    margin-bottom: ${(props) => (props.stepNumber === 2 || props.stepNumber === 1 ? '80px' : '40px')};

    @media (max-width: 960px) {
        display: none;
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
