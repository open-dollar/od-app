import { TransactionReceipt } from '@ethersproject/providers'
import { createStore, EasyPeasyConfig, Store } from 'easy-peasy'
import transactionsModel, { TransactionsModel } from './transactionsModel'
import { BigNumber } from '@ethersproject/bignumber'
import { ITransaction } from '../utils/interfaces'

const mockTx = (chainId: number, addon?: any) => {
    const txReceipt: TransactionReceipt = {
        blockHash: '0x0',
        blockNumber: 23975086,
        contractAddress: '0x0',
        confirmations: 0,
        from: 'abc',
        status: 1,
        to: 'def',
        transactionHash: '0x0',
        transactionIndex: 8,
        gasUsed: BigNumber.from('0'),
        logsBloom: '0we',
        logs: [],
        cumulativeGasUsed: BigNumber.from('0'),
        byzantium: false,
    }

    const newTx: ITransaction = {
        chainId,
        summary: 'hello world',
        hash: '0x0',
        from: 'abc',
        addedTime: Date.now(),
        originalTx: {
            ...txReceipt,
            nonce: 0,
            gasLimit: BigNumber.from('0'),
            gasPrice: BigNumber.from('0'),
            hash: '0x0',
            data: '',
            chainId,
            value: BigNumber.from('0'),
            wait: () => new Promise((resolve, reject) => resolve(txReceipt)),
        },
        ...addon,
    }

    return newTx
}

describe('transaction model', () => {
    let store: Store<TransactionsModel, EasyPeasyConfig<{}, any>>

    beforeEach(() => {
        store = createStore(transactionsModel)
    })

    describe('addTransaction', () => {
        it('adds the transaction', () => {
            const beforeTime = Date.now()
            store.getActions().addTransaction(mockTx(1))
            const txs = store.getState().transactions
            expect(txs[`0x0`]).toBeTruthy()
            expect(txs[`0x0`]).toBeTruthy()
            const tx = txs[`0x0`]
            expect(tx).toBeTruthy()
            expect(tx?.hash).toEqual('0x0')
            expect(tx?.summary).toEqual('hello world')
            expect(tx?.from).toEqual('abc')
            expect(tx?.addedTime).toBeGreaterThanOrEqual(beforeTime)
        })
    })

    describe('finalizeTransaction', () => {
        it('no op if not valid transaction', () => {
            expect(store.getState().transactions).toEqual({})
        })
        it('sets a receipt', () => {
            store.getActions().finalizeTransaction(
                mockTx(42, {
                    receipt: {
                        status: 1,
                        transactionIndex: 1,
                        transactionHash: '0x0',
                        to: '0x0',
                        from: '0x0',
                        contractAddress: '0x0',
                        blockHash: '0x0',
                        blockNumber: 1,
                    },
                })
            )
            const tx = store.getState().transactions['0x0']
            expect(tx?.summary).toEqual('hello world')
            expect(tx?.receipt).toEqual({
                status: 1,
                transactionIndex: 1,
                transactionHash: '0x0',
                to: '0x0',
                from: '0x0',
                contractAddress: '0x0',
                blockHash: '0x0',
                blockNumber: 1,
            })
        })
    })
})
