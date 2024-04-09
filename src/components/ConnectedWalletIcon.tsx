import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'

import Identicon from './Icons/Identicon'
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'

interface Props {
    size?: number
}

const ConnectedWalletIcon = ({ size }: Props) => {
    const { connector } = useWeb3React()

    function getStatusIcon() {
        if (connector instanceof MetaMask) {
            return (
                <IconWrapper size={size || 16} className="sizeMenu">
                    <Identicon />
                </IconWrapper>
            )
        } else if (connector instanceof WalletConnectV2) {
            return (
                <IconWrapper size={size || 16}>
                    <img
                        src={require('../assets/connectors/walletConnectIcon.svg').default}
                        alt={'wallet connect logo'}
                    />
                </IconWrapper>
            )
        } else if (connector instanceof CoinbaseWallet) {
            return (
                <IconWrapper size={size || 16}>
                    <img
                        src={require('../assets/connectors/coinbaseWalletIcon.svg').default}
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

export const IconWrapper = styled.div<{ size?: number; children?: React.ReactNode; className?: string }>`
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
