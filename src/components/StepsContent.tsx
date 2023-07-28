import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Button from './Button'

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

    return (
        <Container id={id}>
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
        </Container>
    )
}

export default StepsContent

const Container = styled.div`
    text-align: center;
    margin-top: 20px;
`

const Title = styled.div`
    font-size: ${(props) => props.theme.font.large};
    font-weight: 600;
    color: ${(props) => props.theme.colors.neutral};
    margin-bottom: 10px;
`

const Text = styled.div`
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.secondary};
    margin-bottom: 20px;
    line-height: 21px;
`
