import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import FeatherIconWrapper, { IconName } from './FeatherIconWrapper'
import { ExternalLinkArrow } from '~/GlobalStyle'
import { getEtherscanLink } from '~/utils'

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
const ToastPayload = ({ icon, iconColor, text, textColor, iconSize, payload }: Props) => {
    const { t } = useTranslation()
    return (
        <Container>
            <FeatherIconWrapper name={icon} color={iconColor} size={iconSize || 20} />
            <div>
                <Text color={textColor}>{text}</Text>
                {payload ? (
                    <a
                        href={getEtherscanLink(payload.chainId, payload.value, payload.type)}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('view_arbiscan')}
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
    padding: 10px 15px;
    background-color: #1a74ec;
    svg {
        margin-right: 15px;
    }
    a {
        ${ExternalLinkArrow}
        font-size: ${(props) => props.theme.font.xSmall};
    }
`

const Text = styled.div<{ color?: string }>`
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => (props.color ? props.color : props.theme.colors.neutral)};
`
