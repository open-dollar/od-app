import { action, Action } from 'easy-peasy'
import { NETWORK_ID } from 'src/connectors'
import { ITransaction } from '../utils/interfaces'

export interface TransactionsModel {
    transactions: { [hash: string]: ITransaction }
    addTransaction: Action<TransactionsModel, ITransaction>
    checkTransaction: Action<
        TransactionsModel,
        { tx: ITransaction; blockNumber: number }
    >
    finalizeTransaction: Action<TransactionsModel, ITransaction>
    clearTransactions: Action<TransactionsModel>
    setTransactions: Action<TransactionsModel, { [hash: string]: ITransaction }>
}
const transactionsModel: TransactionsModel = {
    transactions: {},
    addTransaction: action((state, payload) => {
        state.transactions[payload.hash] = payload
        localStorage.setItem(
            `${payload.from}-${payload.chainId ? payload.chainId : NETWORK_ID}`,
            JSON.stringify(state.transactions)
        )
    }),
    checkTransaction: action((state, payload) => {
        const { tx, blockNumber } = payload
        if (!tx) {
            return
        }
        if (!tx.lastCheckedBlockNumber) {
            tx.lastCheckedBlockNumber = blockNumber
        } else {
            tx.lastCheckedBlockNumber = Math.max(
                blockNumber,
                tx.lastCheckedBlockNumber
            )
        }
        state.transactions[tx.hash] = tx
        localStorage.setItem(
            `${tx.from}-${tx.chainId ? tx.chainId : NETWORK_ID}`,
            JSON.stringify(state.transactions)
        )
    }),
    finalizeTransaction: action((state, payload) => {
        state.transactions[payload.hash] = payload
        localStorage.setItem(
            `${payload.from}-${payload.chainId ? payload.chainId : NETWORK_ID}`,
            JSON.stringify(state.transactions)
        )
    }),
    clearTransactions: action((state, payload) => {
        state.transactions = {}
    }),
    setTransactions: action((state, payload) => {
        state.transactions = payload
    }),
}

export default transactionsModel
