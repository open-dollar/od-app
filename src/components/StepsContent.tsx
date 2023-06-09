import { useState } from 'react'
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

const StepsContent = ({
    title,
    text,
    stepNumber,
    btnText,
    handleClick,
    isDisabled,
    isLoading,
    id,
}: Props) => {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(true)

    const handleOpenState = () => setIsOpen(!isOpen)

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

const Notes = styled.div`
    background: rgba(65, 193, 208, 0.4);
    border-radius: 25px;
    padding: 20px;
    margin-bottom: 20px;
    position: relative;
`

const Heading = styled.div`
    font-size: 18px;
    text-align: center;
    font-weight: bold;
    color: ${(props) => props.theme.colors.neutral};
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
        margin-right: 5px;
    }
`

const List = styled.ul`
    margin: 0;
    padding-left: 20px;
    list-style: none;
    @media (max-width: 767px) {
        padding-left: 0;
    }
`

const Item = styled.li`
    font-size: 15px;
    text-align: left;
    color: ${(props) => props.theme.colors.neutral};
    margin-top: 5px;

    span > div {
        margin: 0;
    }
    svg {
        margin: 0;
    }

    .bullet {
        margin-right: 5px;
        stroke-width: 0;
        fill: #d09e41;
    }

    @media (max-width: 767px) {
        font-size: 13px;
        svg {
            width: 8px !important;
            height: 8px !important;
        }
    }
`

const CloseBtn = styled.div`
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
    svg {
        color: ${(props) => props.theme.colors.secondary};
    }
`

const ReadLink = styled.span`
    color: ${(props) => props.theme.colors.blueish};
    text-decoration: underline;
    cursor: pointer;
`
