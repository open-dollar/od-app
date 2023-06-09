import { utils as gebUtils } from 'geb.js'
import {
    TransactionResponse,
    TransactionRequest,
} from '@ethersproject/providers'
import { JsonRpcSigner } from '@ethersproject/providers/lib/json-rpc-provider'
import { useCallback, useMemo } from 'react'
import { useActiveWeb3React } from '.'
import store from '../store'
import { ITransaction } from '../utils/interfaces'
import { BigNumber } from 'ethers'
import { newTransactionsFirst } from '../utils/helper'

// adding transaction to store
export function useTransactionAdder(): (
    response: TransactionResponse,
    summary?: string,
    approval?: { tokenAddress: string; spender: string }
) => void {
    const { chainId, account } = useActiveWeb3React()
    return useCallback(
        (
            response: TransactionResponse,
            summary?: string,
            approval?: { tokenAddress: string; spender: string }
        ) => {
            if (!account) return
            if (!chainId) return

            const { hash } = response
            if (!hash) {
                throw Error('No transaction hash found.')
            }

            let tx: ITransaction = {
                chainId,
                hash,
                from: account,
                summary,
                addedTime: new Date().getTime(),
                originalTx: response,
                approval,
            }

            store.dispatch.transactionsModel.addTransaction(tx)
        },
        [chainId, account]
    )
}

// add 20%
export function calculateGasMargin(value: BigNumber): BigNumber {
    return value.mul(BigNumber.from(10000 + 2000)).div(BigNumber.from(10000))
}

export function isTransactionRecent(tx: ITransaction): boolean {
    return new Date().getTime() - tx.addedTime < 86_400_000
}

export function useIsTransactionPending(transactionHash?: string): boolean {
    const transactions = store.getState().transactionsModel.transactions

    if (!transactionHash || !transactions[transactionHash]) return false

    return !transactions[transactionHash].receipt
}

// handking transactions gas limit as well as error messages

export async function handlePreTxGasEstimate(
    signer: JsonRpcSigner,
    tx: TransactionRequest,
    floorGasLimit?: string | null
): Promise<TransactionRequest> {
    let gasLimit: BigNumber
    try {
        gasLimit = await signer.estimateGas(tx)
    } catch (err: any) {
        let gebError: string | null
        try {
            const res = await signer.call(tx)
            gebError = gebUtils.getRequireString(res)
        } catch (err) {
            gebError = gebUtils.getRequireString(err)
        }

        let errorMessage: string
        if (gebError) {
            errorMessage = 'Geb error: ' + gebError
        } else {
            errorMessage = 'Provider error: ' + (err || err.message)
        }
        store.dispatch.popupsModel.setIsWaitingModalOpen(true)
        store.dispatch.popupsModel.setWaitingPayload({
            title: 'Transaction Failed.',
            status: 'error',
        })
        console.error(errorMessage)
        throw errorMessage
    }

    // Add 20% slack in the gas limit
    const gasPlus20Percent = gasLimit.mul(120).div(100)

    if (floorGasLimit) {
        const floorGasLimitBN = BigNumber.from(floorGasLimit)
        tx.gasLimit = floorGasLimitBN.gt(gasPlus20Percent)
            ? floorGasLimitBN
            : gasPlus20Percent
    } else {
        tx.gasLimit = gasPlus20Percent
    }

    return tx
}

export function handleTransactionError(e: any) {
    if (
        typeof e === 'string' &&
        (e.toLowerCase().includes('join') || e.toLowerCase().includes('exit'))
    ) {
        store.dispatch.popupsModel.setWaitingPayload({
            title: 'Cannot join/exit at this time.',
            status: 'error',
        })
        return
    }
    if (e?.code === 4001) {
        store.dispatch.popupsModel.setWaitingPayload({
            title: 'Transaction Rejected.',
            status: 'error',
        })
        return
    }
    store.dispatch.popupsModel.setWaitingPayload({
        title: 'Transaction Failed.',
        status: 'error',
    })
    console.error(`Transaction failed`, e)
    console.log('Required String', gebUtils.getRequireString(e))
}

// returns whether a token has a pending approval transaction
export function useHasPendingApproval(
    tokenAddress: string | undefined,
    spender: string | undefined
): boolean {
    const allTransactions = store.getState().transactionsModel.transactions
    return useMemo(
        () =>
            typeof tokenAddress === 'string' &&
            typeof spender === 'string' &&
            Object.keys(allTransactions).some((hash) => {
                const tx = allTransactions[hash]
                if (!tx) return false
                if (tx.receipt) {
                    return false
                } else {
                    const approval = tx.approval
                    if (!approval) return false
                    return (
                        approval.spender === spender &&
                        approval.tokenAddress === tokenAddress &&
                        isTransactionRecent(tx)
                    )
                }
            }),
        [allTransactions, spender, tokenAddress]
    )
}

export function useHasPendingTransactions() {
    const allTransactions = store.getState().transactionsModel.transactions

    const sortedRecentTransactions = useMemo(() => {
        const txs = Object.values(allTransactions)
        return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
    }, [allTransactions])

    return useMemo(() => {
        const pending = sortedRecentTransactions
            .filter((tx) => !tx.receipt)
            .map((tx) => tx.hash)
        return !!pending.length
    }, [sortedRecentTransactions])
}
