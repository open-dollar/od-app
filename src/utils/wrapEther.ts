import { ethers } from 'ethers'
import { JsonRpcSigner } from '@ethersproject/providers'
import { Geb } from '@opendollar/sdk'
import { ETH_NETWORK } from './constants'

export interface WrapEtherProps {
    signer: JsonRpcSigner
    amount: string
    title: string
}
export const handleWrapEther = async ({ signer, amount }: WrapEtherProps) => {
    if (!signer || !amount) {
        return false
    }

    const geb = new Geb(ETH_NETWORK, signer)

    const amountBN = ethers.utils.parseEther(amount)
    const tx = await geb.contracts.weth.populateTransaction.deposit({ value: amountBN })

    if (!tx) throw new Error('No transaction request!')
    const txData = await signer.sendTransaction(tx)
    return txData
}
