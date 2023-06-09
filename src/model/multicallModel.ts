import { action, Action } from 'easy-peasy'
import { ListenerOptions, toCallKey } from '../hooks/Multicall'
import { Call, CallResults, CallListeners } from '../utils/interfaces'

export interface MulticallModel {
    callListeners?: CallListeners
    callResults: CallResults
    addMulticallListeners: Action<
        MulticallModel,
        { chainId: number; calls: Call[]; options?: ListenerOptions }
    >

    removeMulticallListeners: Action<
        MulticallModel,
        { chainId: number; calls: Call[]; options?: ListenerOptions }
    >
    fetchingMulticallResults: Action<
        MulticallModel,
        { chainId: number; calls: Call[]; fetchingBlockNumber: number }
    >

    errorFetchingMulticallResults: Action<
        MulticallModel,
        { chainId: number; calls: Call[]; fetchingBlockNumber: number }
    >
    updateMulticallResults: Action<
        MulticallModel,
        {
            chainId: number
            blockNumber: number
            results: {
                [callKey: string]: string | null
            }
        }
    >
}

const multicallModel: MulticallModel = {
    callResults: {},
    addMulticallListeners: action(
        (state, { calls, chainId, options: { blocksPerFetch = 1 } = {} }) => {
            const listeners = state.callListeners
                ? state.callListeners
                : (state.callListeners = {})
            listeners[chainId] = listeners[chainId] ?? {}
            calls.forEach((call) => {
                const callKey = toCallKey(call)
                listeners[chainId][callKey] = listeners[chainId][callKey] ?? {}
                listeners[chainId][callKey][blocksPerFetch] =
                    (listeners[chainId][callKey][blocksPerFetch] ?? 0) + 1
            })
        }
    ),
    removeMulticallListeners: action(
        (state, { chainId, calls, options: { blocksPerFetch = 1 } = {} }) => {
            const listeners = state.callListeners
                ? state.callListeners
                : (state.callListeners = {})

            if (!listeners[chainId]) return
            calls.forEach((call) => {
                const callKey = toCallKey(call)
                if (!listeners[chainId][callKey]) return
                if (!listeners[chainId][callKey][blocksPerFetch]) return

                if (listeners[chainId][callKey][blocksPerFetch] === 1) {
                    delete listeners[chainId][callKey][blocksPerFetch]
                } else {
                    listeners[chainId][callKey][blocksPerFetch]--
                }
            })
        }
    ),
    fetchingMulticallResults: action(
        (state, { chainId, fetchingBlockNumber, calls }) => {
            state.callResults[chainId] = state.callResults[chainId] ?? {}
            calls.forEach((call) => {
                const callKey = toCallKey(call)
                const current = state.callResults[chainId][callKey]
                if (!current) {
                    state.callResults[chainId][callKey] = {
                        fetchingBlockNumber,
                    }
                } else {
                    if (
                        (current.fetchingBlockNumber ?? 0) >=
                        fetchingBlockNumber
                    )
                        return
                    state.callResults[chainId][callKey].fetchingBlockNumber =
                        fetchingBlockNumber
                }
            })
        }
    ),
    errorFetchingMulticallResults: action(
        (state, { fetchingBlockNumber, chainId, calls }) => {
            state.callResults[chainId] = state.callResults[chainId] ?? {}
            calls.forEach((call) => {
                const callKey = toCallKey(call)
                const current = state.callResults[chainId][callKey]
                if (!current || typeof current.fetchingBlockNumber !== 'number')
                    return // only should be dispatched if we are already fetching
                if (current.fetchingBlockNumber <= fetchingBlockNumber) {
                    delete current.fetchingBlockNumber
                    current.data = null
                    current.blockNumber = fetchingBlockNumber
                }
            })
        }
    ),
    updateMulticallResults: action(
        (state, { chainId, results, blockNumber }) => {
            state.callResults[chainId] = state.callResults[chainId] ?? {}
            Object.keys(results).forEach((callKey) => {
                const current = state.callResults[chainId][callKey]
                if ((current?.blockNumber ?? 0) > blockNumber) return
                state.callResults[chainId][callKey] = {
                    data: results[callKey],
                    blockNumber,
                }
            })
        }
    ),
}

export default multicallModel
