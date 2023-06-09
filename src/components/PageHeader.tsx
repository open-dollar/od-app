import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Button from './Button'

interface IBC {
    [route: string]: string
}
interface Props {
    text?: string
    breadcrumbs: IBC
    btnText?: string
    btnFn?: () => void
}

const PageHeader = ({ text, breadcrumbs, btnText, btnFn }: Props) => {
    return (
        <Container>
            <Title>
                {Object.keys(breadcrumbs).map((bc: string, i: number) => (
                    <TitleBlock key={i + bc}>
                        <Link to={bc}>{breadcrumbs[bc]}</Link>
                        <span>/</span>
                    </TitleBlock>
                ))}
            </Title>
            {text ? (
                <Text>
                    {text}{' '}
                    {btnText && btnFn ? (
                        <>
                            or{' '}
                            <Button
                                data-test-id="header-btn"
                                withArrow
                                text={btnText}
                                onClick={btnFn}
                            />
                        </>
                    ) : null}
                </Text>
            ) : null}
        </Container>
    )
}

export default PageHeader

const Container = styled.div`
    padding: 20px 0 10px;
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
    margin-bottom: 15px;
`

const Title = styled.h3`
    display: flex;
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    letter-spacing: -0.33px;
    color: ${(props) => props.theme.colors.secondary};
    margin-top: 0;
    margin-bottom: 5px;
    align-items: center;
`

const Text = styled.div`
    font-size: 14px;
    line-height: 21px;
    color: ${(props) => props.theme.colors.secondary};
    button {
        img {
            display: none;
        }
    }
`

const TitleBlock = styled.div`
    a {
        color: inherit;
    }
    span {
        margin: 0 5px;
    }

    &:last-child {
        color: ${(props) => props.theme.colors.primary};
        a {
            cursor: not-allowed;
            pointer-events: none;
        }
        span {
            display: none;
        }
    }
`
