/// <reference types="react-scripts" />

import { ExternalProvider } from '@ethersproject/providers'

declare module 'jazzicon' {
    export default function (diameter: number, seed: number): HTMLElement
}
declare module 'comma-number'
type ExtensionForProvider = {
    on: (event: string, callback: (...params: any) => void) => void
    removeListener: (event: string, callback: (...params: any) => void) => void
}
type EthersProvider = ExternalProvider & ExtensionForProvider
declare global {
    interface Window {
        ethereum?: ExternalProvider & ExtensionForProvider
        web3?: {}
    }
}
