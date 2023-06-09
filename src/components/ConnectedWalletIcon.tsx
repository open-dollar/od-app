import { useWeb3React } from '@web3-react/core'
import React from 'react'
import styled from 'styled-components'
import { injected, walletconnect, walletlink } from '../connectors'
import Identicon from './Icons/Identicon'

interface Props {
    size?: number
}

const ConnectedWalletIcon = ({ size }: Props) => {
    const { connector } = useWeb3React()

    function getStatusIcon() {
        if (connector === injected) {
            return (
                <IconWrapper size={size || 16} className="sizeMenu">
                    <Identicon />
                </IconWrapper>
            )
        } else if (connector === walletconnect) {
            return (
                <IconWrapper size={size || 16}>
                    <img
                        src={
                            require('../assets/connectors/walletConnectIcon.svg')
                                .default
                        }
                        alt={'wallet connect logo'}
                    />
                </IconWrapper>
            )
        } else if (connector === walletlink) {
            return (
                <IconWrapper size={size || 16}>
                    <img
                        src={
                            require('../assets/connectors/coinbaseWalletIcon.svg')
                                .default
                        }
                        alt={'coinbase wallet logo'}
                    />
                </IconWrapper>
            )
        }
        return null
    }
    return getStatusIcon()
}

export default ConnectedWalletIcon

const IconWrapper = styled.div<{ size?: number }>`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    & > img,
    span,
    svg {
        height: ${({ size }) => (size ? size + 'px' : '32px')};
        width: ${({ size }) => (size ? size + 'px' : '32px')};
    }

    div {
        height: ${({ size }) => (size ? size + 'px' : '32px')} !important;
        width: ${({ size }) => (size ? size + 'px' : '32px')} !important;
        svg {
            rect {
                height: ${({ size }) =>
                    size ? size + 'px' : '32px'} !important;
                width: ${({ size }) =>
                    size ? size + 'px' : '32px'} !important;
            }
        }
    }
`
