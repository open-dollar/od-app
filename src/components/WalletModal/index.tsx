// Copyright (C) 2020  Uniswap
// https://github.com/Uniswap/uniswap-interface

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import usePrevious from '../../hooks/usePrevious'

import Modal from '../Modals/Modal'
import { useStoreActions, useStoreState } from '../../store'
import { useTranslation } from 'react-i18next'
import AccountCardsWeb3ReactV2 from '~/components/AccountCardsWeb3ReactV2'

const WALLET_VIEWS = {
    OPTIONS: 'options',
    OPTIONS_SECONDARY: 'options_secondary',
    ACCOUNT: 'account',
    PENDING: 'pending',
}

export async function checkAndSwitchMetamaskNetwork() {
    // @ts-ignore
    if (window.ethereum && window.ethereum.isMetaMask && typeof window.ethereum.request === 'function') {
        // @ts-ignore
        const chainId = await window.ethereum.request({ method: 'net_version' })
        // Check if chain ID is same as REACT_APP_NETWORK_ID and prompt user to switch networks if not
        if (chainId !== process.env.REACT_APP_NETWORK_ID && process.env.REACT_APP_NETWORK_ID === '42161') {
            try {
                // @ts-ignore
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: `0xA4B1`,
                            chainName: 'Arbitrum One',
                            nativeCurrency: {
                                name: 'ETH',
                                symbol: 'ETH',
                                decimals: 18,
                            },
                            rpcUrls: ['https://arbitrum-one.publicnode.com'],
                            blockExplorerUrls: ['https://arbiscan.io/'],
                        },
                    ],
                })
            } catch (error) {
                console.error('Failed to switch network', error)
            }
        } else if (chainId !== process.env.REACT_APP_NETWORK_ID && process.env.REACT_APP_NETWORK_ID === '10') {
            try {
                // @ts-ignore
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: `0xA`,
                            chainName: 'OP Mainnet',
                            nativeCurrency: {
                                name: 'ETH',
                                symbol: 'ETH',
                                decimals: 18,
                            },
                            rpcUrls: ['https://optimism-rpc.publicnode.com'],
                            blockExplorerUrls: ['https://optimistic.etherscan.io/'],
                        },
                    ],
                })
            } catch (error) {
                console.error('Failed to switch network', error)
            }
        } else {
            try {
                // @ts-ignore
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: `0x66EEE`,
                            chainName: 'Arbitrum Sepolia',
                            nativeCurrency: {
                                name: 'ETH',
                                symbol: 'ETH',
                                decimals: 18,
                            },
                            rpcUrls: ['https://arbitrum-sepolia.blockpi.network/v1/rpc/public'],
                            blockExplorerUrls: ['https://sepolia.arbiscan.io/'],
                        },
                    ],
                })
            } catch (error) {
                console.error('Failed to switch network', error)
            }
        }
    } else {
        console.log('MetaMask is not installed')
    }
}

export default function WalletModal() {
    const { t } = useTranslation()
    const { popupsModel: popupsState } = useStoreState((state) => state)
    const { popupsModel: popupsActions } = useStoreActions((state) => state)
    const { isConnectorsWalletOpen } = popupsState

    const { isActive, connector, chainId } = useWeb3React()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_pendingError, setPendingError] = useState<boolean>()

    const toggleWalletModal = () => popupsActions.setIsConnectorsWalletOpen(!isConnectorsWalletOpen)

    // always reset to account view
    useEffect(() => {
        if (isConnectorsWalletOpen) {
            setPendingError(false)
            setWalletView(WALLET_VIEWS.ACCOUNT)
        }
    }, [isConnectorsWalletOpen])

    // close modal when a connection is successful
    const activePrevious = usePrevious(isActive)
    const connectorPrevious = usePrevious(connector)
    useEffect(() => {
        if (
            isConnectorsWalletOpen &&
            ((isActive && !activePrevious) || (connector && connector !== connectorPrevious))
        ) {
            setWalletView(WALLET_VIEWS.ACCOUNT)
        }
    }, [setWalletView, isActive, connector, isConnectorsWalletOpen, activePrevious, connectorPrevious])

    function getHeaderContent() {
        if (process.env.REACT_APP_NETWORK_ID === '42161') {
            return (
                <h5>
                    {t('not_supported')}{' '}
                    <a target="_blank" rel="noreferrer" href="//chainlist.org/chain/42161">
                        Arbitrum One
                    </a>
                </h5>
            )
        } else if (process.env.REACT_APP_NETWORK_ID === '10') {
            return (
                <h5>
                    {t('not_supported')}{' '}
                    <a target="_blank" rel="noreferrer" href="//chainlist.org/chain/10">
                        OP Mainnet
                    </a>
                </h5>
            )
        } else if (process.env.REACT_APP_NETWORK_ID === '420') {
            return (
                <h5>
                    {t('not_supported')}{' '}
                    <a target="_blank" rel="noreferrer" href="//chainlist.org/chain/420">
                        OP Goerli
                    </a>
                </h5>
            )
        } else {
            return (
                <h5>
                    {t('not_supported')}{' '}
                    <a target="_blank" rel="noreferrer" href="//chainlist.org/chain/421614">
                        Arbitrum Sepolia
                    </a>
                </h5>
            )
        }
    }

    function getModalContent() {
        return (
            <UpperSection>
                {String(chainId) !== process.env.REACT_APP_NETWORK_ID && chainId !== undefined ? (
                    <>
                        <HeaderRow>{'Wrong Network'}</HeaderRow>
                        <ContentWrapper>{getHeaderContent()}</ContentWrapper>
                    </>
                ) : (
                    <HeaderRow>
                        <HoverText>{t('connect_wallet_title')}</HoverText>
                        <AccountCardsWeb3ReactV2 />
                    </HeaderRow>
                )}
            </UpperSection>
        )
    }

    return (
        <Modal
            isModalOpen={isConnectorsWalletOpen}
            closeModal={toggleWalletModal}
            width={'400px'}
            backDropClose
            handleModalContent
        >
            <Wrapper>{getModalContent()}</Wrapper>
        </Modal>
    )
}

const Wrapper = styled.div`
    background: linear-gradient(to bottom, #1a74ec, #6396ff);
    border-radius: 2.43px;
    padding: 1rem;
    width: 100%;
`

const HeaderRow = styled.div`
    text-align: center;
    font-weight: 800;
`

const ContentWrapper = styled.div`
    padding: 20px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
`

const UpperSection = styled.div`
    position: relative;

    h5 {
        margin: 0;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        font-weight: 400;
    }

    h5:last-child {
        margin-bottom: 0px;
    }

    h4 {
        margin-top: 0;
        font-weight: 500;
    }
`

const HoverText = styled.div`
    color: ${(props) => props.theme.colors.neutral};
    position: relative;
    font-size: 19.04px;
    line-height: 25.93px;
    font-weight: 700;
    top: 10px;
    :hover {
        cursor: pointer;
    }
    padding-bottom: 24.89px;
    margin-bottom: 24.89px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`
