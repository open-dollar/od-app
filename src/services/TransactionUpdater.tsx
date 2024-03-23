import { useEffect, useMemo } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { toast } from 'react-toastify'
import { useActiveWeb3React } from '../hooks'
import store, { useStoreState } from '../store'

export function shouldCheck(
    lastBlockNumber: number,
    tx: { addedTime: number; receipt?: {}; lastCheckedBlockNumber?: number }
): boolean {
    if (tx.receipt) return false
    if (!tx.lastCheckedBlockNumber) return true
    const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
    if (blocksSinceCheck < 1) return false
    const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
    if (minutesPending > 60) {
        // every 10 blocks if pending for longer than an hour
        return blocksSinceCheck > 9
    } else if (minutesPending > 5) {
        // every 3 blocks if pending more than 5 minutes
        return blocksSinceCheck > 2
    } else {
        // otherwise every block
        return true
    }
}

export default function TransactionUpdater(): null {
    const { chainId, provider } = useActiveWeb3React()
    const { transactionsModel: state, connectWalletModel: connectedWalletState } = useStoreState((state) => state)

    const lastBlockNumber = chainId ? connectedWalletState.blockNumber[chainId] : null

    const transactions = useMemo(() => (chainId ? state.transactions ?? {} : {}), [chainId, state])

    useEffect(() => {
        if (!chainId || !provider || !lastBlockNumber) return

        Object.keys(transactions)
            .filter((hash) => shouldCheck(lastBlockNumber, transactions[hash]))
            .forEach((hash) => {
                provider
                    .getTransactionReceipt(hash)
                    .then((receipt) => {
                        if (receipt) {
                            store.dispatch.transactionsModel.finalizeTransaction({
                                ...transactions[hash],
                                receipt: {
                                    blockHash: receipt.blockHash,
                                    blockNumber: receipt.blockNumber,
                                    contractAddress: receipt.contractAddress,
                                    from: receipt.from,
                                    status: receipt.status,
                                    to: receipt.to,
                                    transactionHash: receipt.transactionHash,
                                    transactionIndex: receipt.transactionIndex,
                                },
                                confirmedTime: new Date().getTime(),
                            })
                        } else {
                            store.dispatch.transactionsModel.checkTransaction({
                                tx: transactions[hash],
                                blockNumber: lastBlockNumber,
                            })
                        }
                    })
                    .catch((error) => {
                        console.error(`failed to check transaction hash: ${hash}`, error)
                    })
            })
    }, [chainId, provider, transactions, lastBlockNumber])

    return null
}
