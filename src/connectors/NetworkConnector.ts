// Copyright (C) 2023  Uniswap
// https://github.com/Uniswap/web3-react

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import invariant from 'tiny-invariant'
import { AbstractConnector } from '@web3-react/abstract-connector'

interface NetworkConnectorArguments {
    urls: { [chainId: number]: string }
    defaultChainId?: number
}

// Taken from v6 @web3-react since type has been removed in used version (v8) https://github.com/Uniswap/web3-react/blob/v6/packages/types/src/index.ts#L5
interface ConnectorUpdate<T = number | string> {
    provider?: any
    chainId?: T
    account?: null | string
}

// taken from ethers.js, compatible interface with web3 provider
type AsyncSendable = {
    isMetaMask?: boolean
    host?: string
    path?: string
    sendAsync?: (request: any, callback: (error: any, response: any) => void) => void
    send?: (request: any, callback: (error: any, response: any) => void) => void
}

class RequestError extends Error {
    constructor(message: string, public code: number, public data?: unknown) {
        super(message)
    }
}

interface BatchItem {
    request: { jsonrpc: '2.0'; id: number; method: string; params: unknown }
    resolve: (result: any) => void
    reject: (error: Error) => void
}

class MiniRpcProvider implements AsyncSendable {
    public readonly isMetaMask: false = false
    public readonly chainId: number
    public readonly url: string
    public readonly host: string
    public readonly path: string
    public readonly batchWaitTimeMs: number

    private readonly connector: NetworkConnector

    private nextId = 1
    private batchTimeoutId: ReturnType<typeof setTimeout> | null = null
    private batch: BatchItem[] = []

    constructor(connector: NetworkConnector, chainId: number, url: string, batchWaitTimeMs?: number) {
        this.connector = connector
        this.chainId = chainId
        this.url = url
        const parsed = new URL(url)
        this.host = parsed.host
        this.path = parsed.pathname
        // how long to wait to batch calls
        this.batchWaitTimeMs = batchWaitTimeMs ?? 50
    }

    public readonly clearBatch = async () => {
        console.debug('Clearing batch', this.batch)
        let batch = this.batch

        batch = batch.filter((b) => {
            if (b.request.method === 'wallet_switchEthereumChain') {
                try {
                    this.connector.changeChainId(parseInt((b.request.params as [{ chainId: string }])[0].chainId))
                    b.resolve({ id: b.request.id })
                } catch (error) {
                    b.reject(error as Error)
                }
                return false
            }
            return true
        })

        this.batch = []
        this.batchTimeoutId = null
        let response: Response
        try {
            response = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    accept: 'application/json',
                },
                body: JSON.stringify(batch.map((item) => item.request)),
            })
        } catch (error) {
            batch.forEach(({ reject }) => reject(new Error('Failed to send batch call')))
            return
        }

        if (!response.ok) {
            batch.forEach(({ reject }) =>
                reject(new RequestError(`${response.status}: ${response.statusText}`, -32000))
            )
            return
        }

        let json
        try {
            json = await response.json()
        } catch (error) {
            batch.forEach(({ reject }) => reject(new Error('Failed to parse JSON response')))
            return
        }
        const byKey = batch.reduce<{ [id: number]: BatchItem }>((memo, current) => {
            memo[current.request.id] = current
            return memo
        }, {})
        for (const result of json) {
            const {
                resolve,
                reject,
                request: { method },
            } = byKey[result.id]
            if ('error' in result) {
                reject(new RequestError(result?.error?.message, result?.error?.code, result?.error?.data))
            } else if ('result' in result && resolve) {
                resolve(result.result)
            } else {
                reject(new RequestError(`Received unexpected JSON-RPC response to ${method} request.`, -32000, result))
            }
        }
    }

    public readonly sendAsync = (
        request: {
            jsonrpc: '2.0'
            id: number | string | null
            method: string
            params?: unknown[] | Record<string, unknown>
        },
        callback: (error: any, response: any) => void
    ): void => {
        this.request(request.method, request.params)
            .then((result) => callback(null, { jsonrpc: '2.0', id: request.id, result }))
            .catch((error) => callback(error, null))
    }

    public readonly request = async (
        method: string | { method: string; params: unknown[] },
        params?: unknown[] | Record<string, unknown>
    ): Promise<unknown> => {
        if (typeof method !== 'string') {
            return this.request(method.method, method.params)
        }
        if (method === 'eth_chainId') {
            return `0x${this.chainId.toString(16)}`
        }
        const promise = new Promise((resolve, reject) => {
            this.batch.push({
                request: {
                    jsonrpc: '2.0',
                    id: this.nextId++,
                    method,
                    params,
                },
                resolve,
                reject,
            })
        })
        this.batchTimeoutId = this.batchTimeoutId ?? setTimeout(this.clearBatch, this.batchWaitTimeMs)
        return promise
    }
}

export class NetworkConnector extends AbstractConnector {
    private readonly providers: { [chainId: number]: MiniRpcProvider }
    private currentChainId: number

    constructor({ urls, defaultChainId }: NetworkConnectorArguments) {
        invariant(defaultChainId || Object.keys(urls).length === 1, 'defaultChainId is a required argument with >1 url')
        super({
            supportedChainIds: Object.keys(urls).map((k): number => Number(k)),
        })

        this.currentChainId = defaultChainId ?? Number(Object.keys(urls)[0])
        this.providers = Object.keys(urls).reduce<{
            [chainId: number]: MiniRpcProvider
        }>((accumulator, chainId) => {
            accumulator[Number(chainId)] = new MiniRpcProvider(this, Number(chainId), urls[Number(chainId)])
            return accumulator
        }, {})
    }

    public get provider(): MiniRpcProvider {
        return this.providers[this.currentChainId]
    }

    public async activate(): Promise<ConnectorUpdate> {
        return {
            provider: this.providers[this.currentChainId],
            chainId: this.currentChainId,
            account: null,
        }
    }

    public async getProvider(): Promise<MiniRpcProvider> {
        return this.providers[this.currentChainId]
    }

    public async getChainId(): Promise<number> {
        return this.currentChainId
    }

    public async getAccount(): Promise<null> {
        return null
    }

    public deactivate() {
        return
    }

    /**
     * Meant to be called only by MiniRpcProvider
     * @param chainId the new chain id
     */
    public changeChainId(chainId: number) {
        if (chainId in this.providers) {
            this.currentChainId = chainId
            this.emitUpdate({
                chainId,
                account: null,
                provider: this.providers[chainId],
            })
        } else {
            throw new Error(`Unsupported chain ID: ${chainId}`)
        }
    }
}
