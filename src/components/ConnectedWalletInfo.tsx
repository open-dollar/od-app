import { useMemo, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { newTransactionsFirst, returnWalletAddress, getEtherscanLink, SUPPORTED_WALLETS } from '~/utils'
import { useStoreActions, useStoreState } from '~/store'
import { isTransactionRecent } from '~/hooks'
import ExpandIcon from './Icons/ExpandIcon'
import Transaction from './Transaction'
import CopyIcon from './Icons/CopyIcon'
import Button from './Button'
import ConnectedWalletIcon from '~/components/ConnectedWalletIcon'
import { MetaMask } from '@web3-react/metamask'

const ConnectedWalletInfo = () => {
    const { t } = useTranslation()

    const { isActive, account, connector, chainId } = useWeb3React()

    const [copied, setCopied] = useState(false)

    const { transactionsModel: transactionsState } = useStoreState((state) => state)
    const { popupsModel: popupsActions, transactionsModel: transactionsActions } = useStoreActions((state) => state)

    const handleChange = () => {
        popupsActions.setIsConnectedWalletModalOpen(false)
        popupsActions.setIsConnectorsWalletOpen(true)
    }

    const formatConnectorName = () => {
        const name = Object.keys(SUPPORTED_WALLETS)
            .filter(
                (k) =>
                    // @ts-ignore
                    SUPPORTED_WALLETS[k].connector === connector &&
                    // @ts-ignore
                    !(connector instanceof MetaMask)
            )
            .map((k) => SUPPORTED_WALLETS[k].name)[0]
        return name
    }

    const sortedRecentTransactions = useMemo(() => {
        const txs = Object.values(transactionsState.transactions)
        return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
    }, [transactionsState.transactions])

    const pendingTransactions = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
    const confirmedTransactions = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)

    const renderTransactions = (transactions: string[]) => {
        return (
            <>
                {transactions.map((hash, i) => {
                    return <Transaction key={i} hash={hash} />
                })}
            </>
        )
    }

    const handleClearTransactions = () => {
        transactionsActions.clearTransactions()
        localStorage.removeItem(`${account}-${chainId}`)
    }

    return (
        <>
            <DataContainer>
                <Connection>
                    {t('connected_with')} {connector ? formatConnectorName() : 'N/A'}
                    <Button text={'change'} onClick={handleChange} />
                </Connection>

                <Address id="web3-account-identifier-row">
                    <ConnectedWalletIcon size={20} />
                    {account && isActive ? returnWalletAddress(account) : 'N/A'}
                </Address>
                {account && isActive ? (
                    <WalletData>
                        {copied ? (
                            <CopyBtn className="greenish">{t('copied')}</CopyBtn>
                        ) : (
                            <CopyToClipboard
                                text={account}
                                onCopy={() => {
                                    setCopied(true)
                                    setTimeout(() => setCopied(false), 500)
                                }}
                            >
                                <CopyBtn>
                                    <CopyIcon /> {t('copy_address')}
                                </CopyBtn>
                            </CopyToClipboard>
                        )}
                        {chainId && account ? (
                            <LinkBtn href={getEtherscanLink(chainId, account, 'address')} target="_blank">
                                <ExpandIcon /> {t('view_etherscan')}
                            </LinkBtn>
                        ) : null}
                    </WalletData>
                ) : null}
            </DataContainer>
            <BtnContainer className="top-up">
                <Button data-test-id="topup-btn" onClick={() => popupsActions.setIsSafeManagerOpen(true)}>
                    <BtnInner>{t('manage_other_safes')}</BtnInner>
                </Button>
            </BtnContainer>
            <TransactionsContainer>
                {!!pendingTransactions.length || !!confirmedTransactions.length ? (
                    <>
                        <Heading>
                            {t('recent_transactions')}
                            <Button text={'clear_all'} withArrow onClick={handleClearTransactions} />
                        </Heading>
                        {renderTransactions(pendingTransactions)}
                        {renderTransactions(confirmedTransactions)}
                    </>
                ) : (
                    t('transaction_msg')
                )}
            </TransactionsContainer>
        </>
    )
}

export default ConnectedWalletInfo

const BtnContainer = styled.div`
    displat: flex;
    justify-content: center;
    margin-top: 24px;
    button {
        min-width: 100px;
        padding: 4px 12px;
    }
    &.top-up {
        right: auto;
        left: 50px;
        top: 50px;
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
      position: static;
      margin-bottom:20px;
      &.top-up {
         display:none;
        }
    `}
`

const BtnInner = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`

const Connection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.neutral};
    button {
        width: auto;
        min-width: auto;
        font-size: ${(props) => props.theme.font.extraSmall};
        padding-top: 2px;
        padding-bottom: 2px;
    }
`

const Address = styled.div`
    display: flex;
    margin: 20px 0;
    align-items: center;
    color: ${(props) => props.theme.colors.neutral};
    img {
        width: 20px;
        margin-right: 10px;
    }
    font-size: ${(props) => props.theme.font.large};
`

const WalletData = styled.div`
    display: flex;
    align-items: center;
    align-items: center;
`

const CopyBtn = styled.div`
    color: ${(props) => props.theme.colors.secondary};
    font-size: ${(props) => props.theme.font.small};
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    svg {
        color: ${(props) => props.theme.colors.secondary};
        width: 15px;
        height: 15px;
        margin-right: 5px;
    }
    &:hover {
        text-decoration: underline;
        color: ${(props) => props.theme.colors.customSecondary};
        svg {
            color: ${(props) => props.theme.colors.customSecondary};
        }
    }

    &.greenish {
        background: ${(props) => props.theme.colors.gradient};
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: ${(props) => props.theme.colors.inputBorderColor};
    }

    margin-right: 20px;
`

const LinkBtn = styled.a`
    color: ${(props) => props.theme.colors.secondary};
    font-size: ${(props) => props.theme.font.small};
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    svg {
        color: ${(props) => props.theme.colors.secondary};
        width: 15px;
        height: 15px;
        margin-right: 5px;
    }

    &:hover {
        text-decoration: underline;
        color: ${(props) => props.theme.colors.customSecondary};
        svg {
            color: ${(props) => props.theme.colors.customSecondary};
        }
    }
`

const DataContainer = styled.div`
    border-radius: 20px;
    padding: 15px;
    border: 1px solid ${(props) => props.theme.colors.border};
`

const TransactionsContainer = styled.div`
    background-color: ${(props) => props.theme.colors.background};
    padding: 20px;
    margin: 20px -20px -20px -20px;
    border-radius: 0 0 25px 25px;
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.customSecondary};
`

const Heading = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: ${(props) => props.theme.font.default};
    color: ${(props) => props.theme.colors.customSecondary};
    margin-bottom: 15px;
    button {
        color: ${(props) => props.theme.colors.blueish};
        img {
            display: none;
        }
    }
`
