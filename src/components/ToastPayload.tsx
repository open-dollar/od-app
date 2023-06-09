import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ExternalLinkArrow } from '../GlobalStyle'
import { getEtherscanLink } from '../utils/helper'
import FeatherIconWrapper, { IconName } from './FeatherIconWrapper'

interface Props {
    icon: IconName
    iconColor: string
    iconSize?: number
    text: string
    textColor?: string
    payload?: {
        type: 'address' | 'transaction' | 'token' | 'block'
        value: string
        chainId: number
    }
}
const ToastPayload = ({
    icon,
    iconColor,
    text,
    textColor,
    iconSize,
    payload,
}: Props) => {
    const { t } = useTranslation()
    return (
        <Container>
            <FeatherIconWrapper
                name={icon}
                color={iconColor}
                size={iconSize || 20}
            />
            <div>
                <Text color={textColor}>{text}</Text>
                {payload ? (
                    <a
                        href={getEtherscanLink(
                            payload.chainId,
                            payload.value,
                            payload.type
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('view_etherscan')}
                    </a>
                ) : null}
            </div>
        </Container>
    )
}

export default ToastPayload

const Container = styled.div`
    display: flex;
    align-items: center;
    svg {
        margin-right: 15px;
    }
    a {
        ${ExternalLinkArrow}
        font-size: ${(props) => props.theme.font.extraSmall};
    }
`

const Text = styled.div<{ color?: string }>`
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) =>
        props.color ? props.color : props.theme.colors.neutral};
`
