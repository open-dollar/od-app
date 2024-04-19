import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import classNames from 'classnames'

import Arrow from './Icons/Arrow'

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
    text?: string
    onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void
    primary?: boolean
    secondary?: boolean
    dimmed?: boolean
    dimmedNormal?: boolean
    withArrow?: boolean
    disabled?: boolean
    isLoading?: boolean
    dimmedWithArrow?: boolean
    isBordered?: boolean
    unstyled?: boolean
    arrowPlacement?: string
    maxSize?: string
    children?: ReactNode
}

const Button = ({
    text,
    onClick,
    dimmed,
    dimmedNormal,
    primary,
    secondary,
    withArrow,
    disabled,
    isLoading,
    dimmedWithArrow,
    isBordered,
    unstyled,
    arrowPlacement = 'left',
    children,
    maxSize,
    ...rest
}: Props) => {
    const { t } = useTranslation()

    const classes = classNames({
        primary,
        secondary,
        dimmedNormal,
    })
    const returnType = () => {
        if (dimmed) {
            return (
                <DimmedBtn {...rest} disabled={disabled} onClick={onClick}>
                    {text && t(text)}
                </DimmedBtn>
            )
        }

        if (dimmedWithArrow) {
            return (
                <DimmedBtn {...rest} disabled={disabled} onClick={onClick}>
                    {arrowPlacement === 'left' ? (
                        <img src={require('../assets/dark-arrow.svg').default} alt={''} />
                    ) : null}
                    {text && t(text)}
                    {arrowPlacement === 'right' ? (
                        <img className="rotate" src={require('../assets/dark-arrow.svg').default} alt={''} />
                    ) : null}
                </DimmedBtn>
            )
        } else if (withArrow) {
            return (
                <ArrowBtn {...rest} disabled={disabled} onClick={onClick}>
                    <span>{text && t(text)}</span> <Arrow />
                </ArrowBtn>
            )
        } else if (isBordered) {
            return (
                <BorderedBtn {...rest} disabled={disabled} onClick={onClick}>
                    <Inner> {text && t(text)}</Inner>
                </BorderedBtn>
            )
        } else if (unstyled) {
            return (
                <UnstyledContainer
                    {...rest}
                    className={classes}
                    disabled={disabled}
                    isLoading={isLoading}
                    onClick={onClick}
                >
                    {text && t(text)}
                    {children || null}
                </UnstyledContainer>
            )
        } else {
            return (
                <Container
                    {...rest}
                    className={classes}
                    disabled={disabled}
                    isLoading={isLoading}
                    onClick={onClick}
                    maxSize={maxSize}
                >
                    {text && t(text)}
                    {children || null}
                </Container>
            )
        }
    }
    return returnType()
}

export default React.memo(Button)

const UnstyledContainer = styled.button<{ isLoading?: boolean }>`
    outline: none;
    cursor: pointer;
    border: none;
    box-shadow: none;
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.neutral};
    background: none;
    transition: all 0.3s ease;

    &:hover {
        opacity: 0.8;
    }

    &:disabled {
        background: ${(props) => (props.isLoading ? props.theme.colors.secondary : props.theme.colors.secondary)};
        cursor: not-allowed;
    }
`

const Container = styled.button<{ isLoading?: boolean; maxSize?: string }>`
    outline: none;
    cursor: pointer;
    width: ${(props) => props.maxSize || '500px'};
    min-width: 134px;
    border: none;
    box-shadow: none;
    padding: 10px 30px 10px 30px;
    line-height: 20px;
    font-size: 18px;
    font-family: 'Open Sans', sans-serif;
    font-weight: 600;
    color: ${(props) => props.theme.colors.neutral};
    background: ${(props) => props.theme.colors.gradientBg};
    border-radius: 3px;
    transition: all 0.3s ease;
    &.dimmedNormal {
        background: ${(props) => props.theme.colors.secondary};
    }
    &.primary {
        background: ${(props) => props.theme.colors.gradientBg};
    }
    &.secondary {
        background: ${(props) => props.theme.colors.secondary};
    }
    &:hover {
        opacity: 0.8;
    }

    &:disabled {
        background: ${(props) => (props.isLoading ? props.theme.colors.placeholder : 'rgb(71, 86, 98, 0.4)')};
        cursor: not-allowed;
        color: #475662;
    }
`

const DimmedBtn = styled.button`
    cursor: pointer;
    border: none;
    box-shadow: none;
    outline: none;
    background: transparent;
    border-radius: 0;
    color: ${(props) => props.theme.colors.secondary};
    font-size: ${(props) => props.theme.font.small};
    font-weight: 600;
    line-height: 24px;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    img {
        margin-right: 3px;
        &.rotate {
            transform: rotate(180deg);
            margin-right: 0;
            margin-left: 3px;
        }
    }
    transition: all 0.3s ease;
    &:hover {
        opacity: 0.8;
    }
    &:disabled {
        cursor: not-allowed;
    }
`

const ArrowBtn = styled.button`
    span {
        background: ${(props) => props.theme.colors.gradient};
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: ${(props) => props.theme.colors.inputBorderColor};
    }
    background: transparent;
    border: 0;
    cursor: pointer;
    box-shadow: none;
    outline: none;
    padding: 0;
    margin: 0;
    font-size: ${(props) => props.theme.font.small};
    font-weight: 600;
    line-height: 24px;
    letter-spacing: -0.18px;
    transition: all 0.3s ease;

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
        &:hover {
            opacity: 0.5;
        }
    }
    &:hover {
        opacity: 0.8;
    }
`

const BorderedBtn = styled.button`
    background: ${(props) => props.theme.colors.gradient};
    padding: 2px;
    border-radius: 25px;
    box-shadow: none;
    outline: none;
    border: 0;
    cursor: pointer;
    &:disabled {
        cursor: not-allowed;
    }
`

const Inner = styled.div`
    background: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.inputBorderColor};
    border-radius: 25px;
    padding: 4px 6px;
    transition: all 0.3s ease;
    &:hover {
        opacity: 0.8;
    }
`
