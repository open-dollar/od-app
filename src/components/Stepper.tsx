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
        <Container isLastStep={isLastStep}>
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

type StepT = {
    title: string
    text: string
}

interface StepperProps {
    step: number
    steps: StepT[]
}

const Stepper: React.FC<StepperProps> = ({ step, steps }: { step: number; steps: StepT[] }) => {
    return (
        <StepperContainer>
            {steps.map((item: StepT, index) => (
                <Step
                    key={index}
                    title={item.title}
                    text={item.text}
                    isCompleted={step > index + 1}
                    isCurrent={index + 1 === step}
                    isLastStep={index === steps.length - 1}
                ></Step>
            ))}
        </StepperContainer>
    )
}

export default Stepper

const Container = styled.div<{ isLastStep: boolean }>`
    display: flex;
    flex: ${(props) => (props.isLastStep ? 'none' : '1')};
    align-items: flex-start;
    flex-direction: column;
`

const StepWrapper = styled.div`
    display: flex;
    width: 100%;
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
    background: ${(props) =>
        props.isCompleted || props.isCurrent ? 'linear-gradient(90deg, #00B1F5 0%, #DDF08B 100%)' : 'transparent'};
    display: flex;
    justify-content: center;
    align-items: center;
`

const Line = styled.div<{ isCompleted: boolean; isCurrent: boolean }>`
    height: 3px;
    flex: 1;
    background: ${(props) => (props.isCompleted ? 'linear-gradient(90deg, #DDF08B 0%, #00B1F5 100%)' : '#1C293A4D')};
`

const Title = styled.h3`
    font-weight: 700;
    text-transform: uppercase;
    font-size: 14px;
    color: #475662;
    display: none;

    @media (min-width: 960px) {
        /* Display on screens wider than 900px */
        display: block;
    }
`

const Text = styled.p`
    font-weight: 400;
    font-size: 18px;
    color: #475662;
    display: none;

    @media (min-width: 960px) {
        /* Display on screens wider than 900px */
        display: block;
    }
`

const StepperContainer = styled.div`
    display: flex;
`
