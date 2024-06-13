import { ethers } from 'ethers'
import { JsonRpcSigner } from '@ethersproject/providers'
import { Geb } from '@opendollar/sdk'

export interface WrapEtherProps {
    signer: JsonRpcSigner
    amount: string
    title: string
    geb: Geb
}
export const handleWrapEther = async ({ signer, amount, geb }: WrapEtherProps) => {
    if (!signer || !amount || !geb) {
        return false
    }

    const amountBN = ethers.utils.parseEther(amount)
    const tx = await geb.contracts.weth.populateTransaction.deposit({ value: amountBN })

    if (!tx) throw new Error('No transaction request!')
    const txData = await signer.sendTransaction(tx)
    return txData
}
