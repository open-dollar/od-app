import styled from 'styled-components'
import Check from './Icons/Check'

interface StepProps {
    title: string
    text: string
    isCompleted: boolean
    isCurrent: boolean
    isLastStep: boolean
}

const Step: React.FC<StepProps> = ({ title, text, isCompleted, isCurrent, isLastStep }) => {
    return (
        <Container>
            <StepWrapper>
                <CircleWrapper>
                    <Circle isCompleted={isCompleted} isCurrent={isCurrent}>
                        {isCompleted && <Check />}
                    </Circle>
                </CircleWrapper>
                {!isLastStep && <Line isCompleted={isCompleted} isCurrent={isCurrent} />}
            </StepWrapper>
            <Title>{title}</Title>
            <Text>{text}</Text>
        </Container>
    )
}

interface StepperProps {
    step: number
}

const Stepper: React.FC<StepperProps> = ({ step }) => {
    const steps = [
        { title: 'Step 1', text: 'Connect Wallet' },
        { title: 'Step 2', text: 'Create Vault Facilitator' },
        { title: 'Step 3', text: 'Create a Vault' },
    ]
    return (
        <StepperContainer>
            {steps.map((item, index) => (
                <Step
                    key={index}
                    title={item.title}
                    text={item.text}
                    isCompleted={step > index + 1}
                    isCurrent={index + 1 === step}
                    isLastStep={index === steps.length - 1}
                >
                </Step>
            ))}
        </StepperContainer>
    )
}

export default Stepper

const Container = styled.div`
    display: flex;
    align-items: flex-start;
    flex-direction: column;
`

const StepWrapper = styled.div`
    display: flex;
    align-items: center;
`

const CircleWrapper = styled.div`
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Circle = styled.div<{ isCompleted: boolean; isCurrent: boolean }>`
    width: ${(props) => (props.isCompleted ? '42px' : '24px')};
    height: ${(props) => (props.isCompleted ? '42px' : '24px')};
    border-radius: 50%;
    border: ${(props) => (props.isCompleted || props.isCurrent ? 'transparent' : '3px solid #1C293A4D')};
    background: ${(props) => (props.isCompleted || props.isCurrent ? 'linear-gradient(90deg, #00B1F5 0%, #DDF08B 100%)' : 'transparent')};
    display: flex;
    justify-content: center;
    align-items: center;
`

const Line = styled.div<{ isCompleted: boolean; isCurrent: boolean }>`
    height: 3px;
    min-width: 340px;
    background: ${(props) => (props.isCompleted ? 'linear-gradient(90deg, #DDF08B 0%, #00B1F5 100%)' : '#1C293A4D')};

    /* @media (min-width: 640px) */
`

const Title = styled.h3`
    font-weight: 700;
    text-transform: uppercase;
    font-size: 14px;
    color: #475662;
`

const Text = styled.p`
    font-weight: 400;
    font-size: 18px;
    color: #475662;
`

const StepperContainer = styled.div`
    display: flex;
`
