import { ethers } from 'ethers'
import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback, useMemo } from 'react'
import store from '../store'
import { useSingleCallResult } from './Multicall'
import {
    calculateGasMargin,
    handleTransactionError,
    useHasPendingApproval,
} from './TransactionHooks'
import { useTokenContract } from './useContract'
import { useActiveWeb3React } from '.'
import useGeb from './useGeb'

export enum ApprovalState {
    UNKNOWN,
    NOT_APPROVED,
    PENDING,
    APPROVED,
}
// checks for token allowance
export function useTokenAllowance(
    tokenAddress?: string,
    owner?: string,
    spender?: string
) {
    const contract = useTokenContract(tokenAddress, false)
    const inputs = useMemo(
        () => (owner && spender ? [owner, spender] : [undefined, undefined]),
        [owner, spender]
    )
    const allowance = useSingleCallResult(contract, 'allowance', inputs).result
    return useMemo(
        () => (tokenAddress && allowance ? allowance[0] : undefined),
        [tokenAddress, allowance]
    )
}

export function useTokenApproval(
    amount: string,
    tokenAddress?: string,
    spender?: string
): [ApprovalState, () => Promise<void>] {
    const { account } = useActiveWeb3React()
    const geb = useGeb()
    const currentAllowance = useTokenAllowance(
        tokenAddress,
        account ?? undefined,
        spender
    )
    const pendingApproval = useHasPendingApproval(tokenAddress, spender)

    // check the current approval status
    const approvalState: ApprovalState = useMemo(() => {
        if (!amount || !tokenAddress || !spender || !geb) {
            return ApprovalState.UNKNOWN
        }

        const amountBN = ethers.utils.parseEther(amount)
        // we might not have enough data to know whether or not we need to approve
        if (!currentAllowance) return ApprovalState.UNKNOWN

        // amountToApprove will be defined if currentAllowance is
        return currentAllowance.lt(amountBN)
            ? pendingApproval
                ? ApprovalState.PENDING
                : ApprovalState.NOT_APPROVED
            : ApprovalState.APPROVED
    }, [amount, currentAllowance, geb, pendingApproval, spender, tokenAddress])

    const tokenContract = useTokenContract(tokenAddress)

    const approve = useCallback(async (): Promise<void> => {
        if (approvalState !== ApprovalState.NOT_APPROVED) {
            console.error('approve was called unnecessarily')
            return
        }
        if (!tokenAddress) {
            console.error('no token')
            return
        }

        if (!tokenContract) {
            console.error('tokenContract is null')
            return
        }

        if (!amount) {
            console.error('missing amount to approve')
            return
        }

        if (!spender) {
            console.error('no spender')
            return
        }

        store.dispatch.popupsModel.setIsWaitingModalOpen(true)
        store.dispatch.popupsModel.setBlockBackdrop(true)
        store.dispatch.popupsModel.setWaitingPayload({
            title: 'Waiting for confirmation',
            text: 'Confirm this transaction in your wallet',
            status: 'loading',
        })

        let useExact = false
        const estimatedGas = await tokenContract.estimateGas
            .approve(spender, MaxUint256)
            .catch(() => {
                // general fallback for tokens who restrict approval amounts
                useExact = true
                return tokenContract.estimateGas.approve(spender, amount)
            })

        return tokenContract
            .approve(spender, useExact ? amount : MaxUint256, {
                gasLimit: calculateGasMargin(estimatedGas),
            })
            .then((txResponse: TransactionResponse) => {
                const { hash, chainId } = txResponse
                store.dispatch.transactionsModel.addTransaction({
                    chainId,
                    hash,
                    from: txResponse.from,
                    summary: 'Token Approval',
                    addedTime: new Date().getTime(),
                    originalTx: txResponse,
                    approval: {
                        tokenAddress,
                        spender,
                    },
                })
                store.dispatch.popupsModel.setWaitingPayload({
                    title: 'Transaction Submitted',
                    hash: txResponse.hash,
                    status: 'success',
                })
            })
            .catch((error: Error) => {
                console.debug('Failed to approve token', error)
                handleTransactionError(error)
                throw error
            })
    }, [approvalState, tokenAddress, tokenContract, amount, spender])

    return [approvalState, approve]
}
