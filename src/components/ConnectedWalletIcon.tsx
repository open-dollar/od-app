import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'

import { injected, walletconnect, walletlink } from '../connectors'
import Identicon from './Icons/Identicon'

interface Props {
    size?: number
}

const ConnectedWalletIcon = ({ size }: Props) => {
    const { connector } = useWeb3React()

    function getStatusIcon() {
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
                height: ${({ size }) => (size ? size + 'px' : '32px')} !important;
                width: ${({ size }) => (size ? size + 'px' : '32px')} !important;
            }
        }
    }
`
