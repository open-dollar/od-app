import { useCallback, useEffect, useState } from 'react'
import { useActiveWeb3React } from '.'
import { useStoreActions, useStoreState } from '../store'
import { timeout } from '../utils/helper'
import useGeb from './useGeb'

// handle await for 10 blocks confirmation before creating a reflexer account
export function use10BlocksConfirmations() {
    const [blocksSinceCheck, setBlocksSinceCheck] = useState<number>()
    const { account, chainId } = useActiveWeb3React()
    const geb = useGeb()
    const {
        connectWalletModel: connectWalletState,
        transactionsModel: transactionsState,
    } = useStoreState((state) => state)
    const {
        connectWalletModel: connectWalletActions,
        popupsModel: popupsActions,
        safeModel: safeActions,
    } = useStoreActions((state) => state)

    const { step, blockNumber, ctHash } = connectWalletState

    const { transactions } = transactionsState

    const returnConfirmations = async () => {
        if (
            !account ||
            !chainId ||
            !blockNumber[chainId] ||
            !ctHash ||
            !geb ||
            !transactions[ctHash] ||
            step !== 1
        ) {
            return null
        }
        connectWalletActions.setIsStepLoading(true)
        const currentBlockNumber = blockNumber[chainId]
        const txBlockNumber = transactions[ctHash].originalTx.blockNumber
        if (!txBlockNumber || !currentBlockNumber) return null
        const diff = currentBlockNumber - txBlockNumber
        setBlocksSinceCheck(diff >= 10 ? 10 : diff)
        if (diff > 10) {
            await timeout(1000)
            safeActions.fetchUserSafes({ address: account as string, geb })
            await timeout(2000)
            popupsActions.setIsWaitingModalOpen(false)
            connectWalletActions.setIsStepLoading(false)
            connectWalletActions.setStep(2)
            localStorage.removeItem('ctHash')
            return null
        }
    }
    // eslint-disable-next-line
    const returnConfCallback = useCallback(returnConfirmations, [
        chainId,
        blockNumber,
        ctHash,
        step,
    ])

    useEffect(() => {
        returnConfCallback()
    }, [returnConfCallback])

    return blocksSinceCheck
}
