import React from 'react'
import { AlertTriangle, ArrowUpRight, CheckCircle } from 'react-feather'
import styled from 'styled-components'
import { ExternalLinkArrow } from '../GlobalStyle'
import { useActiveWeb3React } from '../hooks'
import { useStoreState } from '../store'
import { getEtherscanLink } from '../utils/helper'
import Loader from './Loader'

const Transaction = ({ hash }: { hash: string }) => {
    const { chainId } = useActiveWeb3React()
    const { transactionsModel: transactionsState } = useStoreState(
        (state) => state
    )

    const tx = transactionsState.transactions?.[hash]
    const summary = tx?.summary
    const pending = !tx?.receipt
    const success =
        !pending &&
        tx &&
        (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')

    if (!chainId) return null
    return (
        <Container>
            <a
                href={getEtherscanLink(chainId, hash, 'transaction')}
                target="_blank"
                rel="noopener noreferrer"
            >
                <Text>
                    {summary ?? hash} <ArrowUpRight />
                </Text>
                <IconWrapper pending={pending} success={success}>
                    {pending ? (
                        <Loader />
                    ) : success ? (
                        <CheckCircle size="16" />
                    ) : (
                        <AlertTriangle size="16" />
                    )}
                </IconWrapper>
            </a>
        </Container>
    )
}

export default Transaction

const Container = styled.div`
    a {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`

const Text = styled.div`
    display: flex;
    align-items: center;
    ${ExternalLinkArrow}
    svg {
        width: 14px;
        height: 14px;
        margin-left: 5px;
    }
`

const IconWrapper = styled.div<{ pending: boolean; success?: boolean }>`
    color: ${({ theme, pending, success }) =>
        pending ? theme.colors.inputBorderColor : success ? 'green' : 'red'};
    svg {
        margin-right: 0;
    }
`
