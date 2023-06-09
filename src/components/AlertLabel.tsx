import React from 'react'
import styled from 'styled-components'

interface Props {
    type: string
    text: string
    padding?: string
    isBlock?: boolean
}
const AlertLabel = ({ text, type, padding, isBlock = true }: Props) => {
    return (
        <Container
            className={type ? type : 'alert'}
            isBlock={isBlock}
            style={{
                padding: isBlock ? '0' : padding || '8px',
            }}
        >
            <Flex>
                {isBlock ? <Circle /> : null}
                {text}
            </Flex>
        </Container>
    )
}

export default AlertLabel
const Flex = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const Circle = styled.div`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
`
const Container = styled.div<{ isBlock?: boolean }>`
    padding: 8px;
    height: fit-content;
    text-align: center;
    font-size: ${(props) => props.theme.font.small};
    border-radius: ${(props) => props.theme.global.borderRadius};
    line-height: 21px;
    letter-spacing: -0.09px;
    &.alert {
        border: 1px solid ${(props) => props.theme.colors.alertBorder};
        border-width: ${({ theme, isBlock }) => (isBlock ? '0' : '1px')};
        background: ${({ theme, isBlock }) =>
            isBlock ? 'transparent' : theme.colors.alertBackground};
        color: ${({ theme, isBlock }) =>
            isBlock ? theme.colors.customSecondary : theme.colors.alertColor};
        ${Circle} {
            background: ${(props) => props.theme.colors.alertColor};
        }
    }
    &.success {
        border: 1px solid ${(props) => props.theme.colors.successBorder};
        border-width: ${({ theme, isBlock }) => (isBlock ? '0' : '1px')};
        background: ${({ theme, isBlock }) =>
            isBlock ? 'transparent' : theme.colors.successBackground};
        color: ${({ theme, isBlock }) =>
            isBlock ? theme.colors.customSecondary : theme.colors.successColor};
        ${Circle} {
            background: ${(props) => props.theme.colors.successColor};
        }
    }
    &.danger {
        border: 1px solid ${(props) => props.theme.colors.dangerColor};
        border-width: ${({ theme, isBlock }) => (isBlock ? '0' : '1px')};
        background: ${({ theme, isBlock }) =>
            isBlock ? 'transparent' : theme.colors.dangerBackground};
        color: ${({ theme, isBlock }) =>
            isBlock ? theme.colors.customSecondary : theme.colors.dangerColor};
        ${Circle} {
            background: ${(props) => props.theme.colors.dangerColor};
        }
    }
    &.warning {
        border: 1px solid ${(props) => props.theme.colors.warningBorder};
        border-width: ${({ theme, isBlock }) => (isBlock ? '0' : '1px')};
        background: ${({ theme, isBlock }) =>
            isBlock ? 'transparent' : theme.colors.warningBackground};
        color: ${({ theme, isBlock }) =>
            isBlock ? theme.colors.customSecondary : theme.colors.warningColor};
        ${Circle} {
            background: ${(props) => props.theme.colors.warningColor};
        }
    }

    &.dimmed {
        border: 1px solid #959595;
        background: ${({ theme, isBlock }) =>
            isBlock ? 'transparent' : theme.colors.secondary};
        color: #fff;
        ${Circle} {
        }
    }

    &.gradient {
        border: 1px solid
            ${({ theme, isBlock }) =>
                isBlock ? 'transparent' : theme.colors.inputBorderColor};
        background: ${({ theme, isBlock }) =>
            isBlock ? 'transparent' : theme.colors.gradient};
        color: #fff;
        ${Circle} {
            background: ${(props) => props.theme.colors.inputBorderColor};
        }
    }

    &.greenish {
        border: 1px solid ${(props) => props.theme.colors.inputBorderColor};
        background: #6dbab5;
        color: #fff;
        ${Circle} {
            background: #6dbab5;
        }
    }

    &.floated {
        position: fixed;
        width: 100%;
        left: 0;
        right: 0;
        z-index: 996;
    }
    border-width: ${({ theme, isBlock }) => (isBlock ? '0' : '1px')};
`
