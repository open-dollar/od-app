import 'cypress-wait-until'
import { Wallet } from '@ethersproject/wallet'
import { JsonRpcProvider, TransactionRequest, TransactionResponse } from '@ethersproject/providers'
import { Eip1193Bridge } from '@ethersproject/experimental/lib/eip1193-bridge'
import { Signer } from '@ethersproject/abstract-signer'

// never send real ether to this, obviously

// Test account if no Open Dollar account/proxy
export const PRIVATE_KEY_NO_PROXY_NEVER_USER = 'fc568e2480f8ebef0d3efd72ef633f4433019fc146b9fba90e2de46b2ad31e71'
export const ADDRESS_NO_PROXY_NEVER_USER = '0xf3BF66D6c8f425eD0Dc2B3842401fe17eC459Af3'

// Test account if no Open Dollar account/proxy
export const PRIVATE_KEY_NO_SAFES_NEVER_USER = '0x4629da46e55e1fb4a19ce06a7e57455dff0b4b382b20c51ea6d3cf3c149db863'
export const ADDRESS_NO_SAFES_NEVER_USER = '0x9407Ff9cd0cB64A534d69Fbd61402467359E1903'

// Test account if there is Open Dollar account and user has safes
export const PRIVATE_KEY_TEST_NEVER_USE = '0xf29f8d47c750d03d472152d5ccba4bbff99caaad0d6c7d326b20c33fa715d8c8'
export const TEST_ADDRESS_NEVER_USE = '0x6C5CCF22147A96e27855E26bC6824EB76497D112'

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
    constructor(signer: Signer, provider: JsonRpcProvider, address: string, allowTx: boolean) {
        super(signer, provider)
        this.address = address
        this.allowTx = allowTx
    }
    async sendAsync(
        request: { method: string; params?: any[] },
        callback: (error: any, response: any) => void
    ): Promise<void> {
        console.debug('sendAsync called', request)
        this.send(request.method, request.params)
            .then((result) => callback(null, { result }))
            .catch((error) => callback(error, null))
    }
    async send(method: string, params?: any[]): Promise<any> {
        console.debug('send called', method, params)
        if (method === 'eth_sendTransaction' && this.allowTx) {
            const txReq: TransactionRequest = params![0]
            let custom_tx = renameKeys(txReq, { gas: 'gasLimit' })
            const { hash }: TransactionResponse = await this.signer.sendTransaction(custom_tx)
            return hash
        }
        if (method === 'eth_requestAccounts' || method === 'eth_accounts') {
            return [this.address]
        }
        if (method === 'eth_chainId') {
            return 42
        }
        return super.send(method, params)
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
    const { privateKey, walletAddress, allowTx } = returnWallet(options && options.qs ? options.qs.type : '')
    return original(url, {
        ...options,
        //@ts-ignore
        onBeforeLoad(win) {
            options && options.onBeforeLoad && options.onBeforeLoad(win)
            win.localStorage.clear()
            const provider = new JsonRpcProvider('https://arbitrum-sepolia.public.blastapi.io', 420)
            const signer = new Wallet(privateKey, provider)
            win.ethereum = new CustomizedBridge(signer, provider, walletAddress, allowTx)
        },
    })
})
