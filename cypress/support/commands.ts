// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import 'cypress-wait-until'
import { Wallet } from '@ethersproject/wallet'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Eip1193Bridge } from '@ethersproject/experimental/lib/eip1193-bridge'
import { Signer } from '@ethersproject/abstract-signer'

// never send real ether to this, obviously

// Test account if no reflexer account/proxy
export const PRIVATE_KEY_NO_PROXY_NEVER_USER =
    'fc568e2480f8ebef0d3efd72ef633f4433019fc146b9fba90e2de46b2ad31e71'
export const ADDRESS_NO_PROXY_NEVER_USER =
    '0xf3BF66D6c8f425eD0Dc2B3842401fe17eC459Af3'

// Test account if no reflexer account/proxy
export const PRIVATE_KEY_NO_SAFES_NEVER_USER =
    '0x4629da46e55e1fb4a19ce06a7e57455dff0b4b382b20c51ea6d3cf3c149db863'
export const ADDRESS_NO_SAFES_NEVER_USER =
    '0x9407Ff9cd0cB64A534d69Fbd61402467359E1903'

// Test account if there is reflexer account and user has safes
export const PRIVATE_KEY_TEST_NEVER_USE =
    '0xf29f8d47c750d03d472152d5ccba4bbff99caaad0d6c7d326b20c33fa715d8c8'
export const TEST_ADDRESS_NEVER_USE =
    '0x6C5CCF22147A96e27855E26bC6824EB76497D112'

export const returnWalletAddress = (walletAddress: string) =>
    `${walletAddress.slice(0, 4 + 2)}...${walletAddress.slice(-4)}`

function renameKeys(obj: any, newKeys: any) {
    const keyValues = Object.keys(obj).map((key) => {
        const newKey = newKeys[key] || key
        return { [newKey]: obj[key] }
    })
    return Object.assign({}, ...keyValues)
}
export class CustomizedBridge extends Eip1193Bridge {
    address: string
    allowTx: boolean = false
    constructor(
        signer: Signer,
        provider: JsonRpcProvider,
        address: string,
        allowTx: boolean
    ) {
        super(signer, provider)
        this.address = address
        this.allowTx = allowTx
    }
    //@ts-ignore
    async sendAsync(...args) {
        console.debug('sendAsync called', ...args)
        return this.send(...args)
    }
    //@ts-ignore
    async send(...args) {
        console.debug('send called', ...args)
        const isCallbackForm =
            typeof args[0] === 'object' && typeof args[1] === 'function'
        let callback
        let method
        let params
        if (isCallbackForm) {
            callback = args[1]
            method = args[0].method
            params = args[0].params
        } else {
            method = args[0]
            params = args[1]
        }

        if (method === 'eth_sendTransaction' && this.allowTx) {
            const txReq = params[0]
            let custom_tx = renameKeys(txReq, { gas: 'gasLimit' })
            const { hash } = await this.signer.sendTransaction(custom_tx)
            if (isCallbackForm) {
                callback(null, { result: hash })
            } else {
                return Promise.resolve(hash)
            }
        }
        if (method === 'eth_requestAccounts' || method === 'eth_accounts') {
            if (isCallbackForm) {
                callback({ result: [this.address] })
            } else {
                return Promise.resolve([this.address])
            }
        }
        if (method === 'eth_chainId') {
            if (isCallbackForm) {
                callback(null, { result: 42 })
            } else {
                return Promise.resolve(42)
            }
        }
        try {
            const result = await super.send(method, params)
            console.debug('result received', method, params, result)
            if (isCallbackForm) {
                callback(null, { result })
            } else {
                return result
            }
        } catch (error) {
            if (isCallbackForm) {
                callback(error, null)
            } else {
                throw error
            }
        }
    }
}

const returnWallet = (type: string) => {
    switch (type) {
        case 'no_safes':
            return {
                privateKey: PRIVATE_KEY_NO_SAFES_NEVER_USER,
                walletAddress: ADDRESS_NO_SAFES_NEVER_USER,
                allowTx: false,
            }
        case 'no_proxy':
            return {
                privateKey: PRIVATE_KEY_NO_PROXY_NEVER_USER,
                walletAddress: ADDRESS_NO_PROXY_NEVER_USER,
                allowTx: false,
            }
        default:
            return {
                privateKey: PRIVATE_KEY_TEST_NEVER_USE,
                walletAddress: TEST_ADDRESS_NEVER_USE,
                allowTx: true,
            }
    }
}

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})

Cypress.Commands.overwrite('visit', (original, url, options) => {
    const { privateKey, walletAddress, allowTx } = returnWallet(
        options && options.qs ? options.qs.type : ''
    )
    return original(url, {
        ...options,
        //@ts-ignore
        onBeforeLoad(win) {
            options && options.onBeforeLoad && options.onBeforeLoad(win)
            win.localStorage.clear()
            const provider = new JsonRpcProvider(
                'https://kovan.infura.io/v3/645c2c65dd8f4be18a50a0bf011bab85',
                42
            )
            const signer = new Wallet(privateKey, provider)
            win.ethereum = new CustomizedBridge(
                signer,
                provider,
                walletAddress,
                allowTx
            )
        },
    })
})
