/// <reference types="react-scripts" />

import { ExternalProvider } from '@ethersproject/providers'

declare module 'jazzicon' {
    export default function (diameter: number, seed: number): HTMLElement
}
declare module 'comma-number'
declare global {
    interface Window {
        ethereum?: ExternalProvider
        web3?: {}
    }
}
