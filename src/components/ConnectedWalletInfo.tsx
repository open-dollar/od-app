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
import { Info } from 'react-feather'
import { Tooltip as ReactTooltip } from 'react-tooltip'

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
                <Row>
                    <Connection>
                        {t('connected_with')} {connector ? formatConnectorName() : 'N/A'}
                        <Button text={'Change'} disabled={connector instanceof MetaMask} onClick={handleChange} />
                    </Connection>
                    {connector instanceof MetaMask ? (
                        <>
                            <ReactTooltip id="browserWalletDisconnectTooltip" variant="light" data-effect="solid" />
                            <Info
                                data-tooltip-id="browserWalletDisconnectTooltip"
                                data-tooltip-content={t('browser_wallet_disconnect_not_supported')}
                                color="white"
                                size="20"
                            />
                        </>
                    ) : (
                        <></>
                    )}
                </Row>
                <Address id="web3-account-identifier-row">
                    <ConnectedWalletIcon size={18} />
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
                                <ExpandIcon /> {t('view_arbiscan')}
                            </LinkBtn>
                        ) : null}
                    </WalletData>
                ) : null}
            </DataContainer>
            <BtnContainer className="top-up">
                <Button data-test-id="topup-btn" onClick={() => popupsActions.setIsSafeManagerOpen(true)}>
                    <>{t('manage_other_safes')}</>
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

const Row = styled.div`
    align-items: center;
    display: flex;
    gap: 4px;
`

const BtnContainer = styled.div`
    button {
        border: #e2f1ff 1px solid;
    }
`

const Connection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.neutral};
    width: 100%;
    button {
        width: auto;
        min-width: auto;
        font-size: ${(props) => props.theme.font.xSmall};
        padding-top: 2px;
        padding-bottom: 2px;
    }
`

const Address = styled.div`
    display: flex;
    margin: 20px 0;
    align-items: center;
    line-height: 20px;
    color: ${(props) => props.theme.colors.neutral};
    img {
        width: 20px;
        margin-right: 10px;
    }
    font-size: ${(props) => props.theme.font.medium};
`

const WalletData = styled.div`
    display: flex;
    align-items: center;
`

const CopyBtn = styled.button`
    background-color: transparent;
    color: #ffffff;
    font-size: ${(props) => props.theme.font.xxSmall};
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-right: 20px;
    transition: all 0.3s ease;
    gap: 4px;

    &:hover {
        color: #b3ceff;
    }
`

const LinkBtn = styled.a`
    color: #ffffff;
    font-size: ${(props) => props.theme.font.xxSmall};
    transition: color 0.3s ease;
    display: flex;
    align-items: center;
    gap: 4px;

    &:hover {
        color: #b3ceff;
    }
`

const DataContainer = styled.div`
    border-radius: 4px;
    padding: 0 0 15px 0;
`

const TransactionsContainer = styled.div`
    padding: 20px;
    color: white;
    margin: 0px -20px -20px -20px;
    border-radius: 0 0 25px 25px;
    font-size: ${(props) => props.theme.font.xSmall};
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
