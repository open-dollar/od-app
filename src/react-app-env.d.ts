/// <reference types="react-scripts" />

declare module 'jazzicon' {
    export default function (diameter: number, seed: number): HTMLElement
}
declare module 'comma-number'
interface Window {
    ethereum?: {
        isMetaMask?: true
        on?: (...args: any[]) => void
        removeListener?: (...args: any[]) => void
    }
    web3?: {}
}
