import { JsonRpcSigner } from '@ethersproject/providers/lib/json-rpc-provider'
import { Geb, TransactionRequest } from '@hai-on-op/sdk'
import { BigNumber, ethers, utils as ethersUtils } from 'ethers'

import { handlePreTxGasEstimate } from '~/hooks'
import { ETH_NETWORK, ISafeData } from '~/utils'

const abi = ['function drop() public view returns ()']

export const claimAirdrop = async (signer: JsonRpcSigner) => {
    if (!signer) return

    const airdropContract = new ethers.Contract('0xb131611c5010dcc71925cdbe29f0e8aabb2625db', abi, signer)

    let txData = await airdropContract.populateTransaction.drop()

    const tx = await handlePreTxGasEstimate(signer, txData)

    const txResponse = await signer.sendTransaction(tx)

    return txResponse
}

export const liquidateSafe = async (geb: Geb, safeId: string) => {
    // Only a signer will be able to execute the tx. Not a provider.
    const signerIsValid = geb.signer && ethers.providers.JsonRpcSigner.isSigner(geb.signer)
    if (!signerIsValid) return

    const signer = geb.signer as JsonRpcSigner

    const txData = await geb.liquidations.liquidateSAFE(safeId)

    const tx = await handlePreTxGasEstimate(signer, txData)

    const txResponse = await signer.sendTransaction(tx)

    return txResponse
}

export const handleDepositAndBorrow = async (signer: JsonRpcSigner, safeData: ISafeData, safeId = '') => {
    if (!signer || !safeData) {
        return false
    }

    const collateralBN = safeData.leftInput ? ethersUtils.parseEther(safeData.leftInput) : ethersUtils.parseEther('0')
    const debtBN = safeData.rightInput ? ethersUtils.parseEther(safeData.rightInput) : ethersUtils.parseEther('0')

    const geb = new Geb(ETH_NETWORK, signer)

    const proxy = await geb.getProxyAction(signer._address)

    let txData: TransactionRequest = {}

    if (safeId) {
        if (collateralBN.isZero() && !debtBN.isZero()) {
            txData = await proxy.generateDebt(safeId, debtBN)
        } else if (!collateralBN.isZero() && debtBN.isZero()) {
            txData = await proxy.lockTokenCollateral(safeData.collateral, safeId, collateralBN, true)
        } else {
            txData = await proxy.lockTokenCollateralAndGenerateDebt(
                safeData.collateral,
                safeId,
                collateralBN,
                debtBN,
                true
            )
        }
    } else {
        txData = await proxy.openLockTokenCollateralAndGenerateDebt(safeData.collateral, collateralBN, debtBN, true)
    }

    if (!txData) throw new Error('No transaction request!')

    const tx = await handlePreTxGasEstimate(signer, txData, safeId ? null : '865000')

    const txResponse = await signer.sendTransaction(tx)
    return txResponse
}

export const handleRepayAndWithdraw = async (signer: JsonRpcSigner, safeData: ISafeData, safeId: string) => {
    if (!signer || !safeData) {
        return false
    }
    if (!safeId) throw new Error('No safe Id')

    const geb = new Geb(ETH_NETWORK, signer)

    const totalDebtBN = ethersUtils.parseEther(safeData.totalDebt)
    const totalCollateralBN = ethersUtils.parseEther(safeData.totalCollateral)
    const collateralToFree = ethersUtils.parseEther(safeData.leftInput)
    const haiToRepay = ethersUtils.parseEther(safeData.rightInput)
    const proxy = await geb.getProxyAction(signer._address)

    let txData: TransactionRequest = {}

    if (!collateralToFree.isZero() && !haiToRepay.isZero() && totalCollateralBN.isZero() && totalDebtBN.isZero()) {
        txData = await proxy.repayAllDebtAndFreeTokenCollateral(safeData.collateral, safeId, collateralToFree)
    } else if (collateralToFree.isZero() && totalDebtBN.isZero() && !haiToRepay.isZero()) {
        txData = await proxy.repayAllDebt(safeId)
    } else if (collateralToFree.isZero() && !haiToRepay.isZero()) {
        txData = await proxy.repayDebt(safeId, haiToRepay)
    } else if (!collateralToFree.isZero() && haiToRepay.isZero()) {
        txData = await proxy.freeTokenCollateral(safeData.collateral, safeId, collateralToFree)
    } else {
        txData = await proxy.repayDebtAndFreeTokenCollateral(safeData.collateral, safeId, collateralToFree, haiToRepay)
    }

    if (!txData) throw new Error('No transaction request!')

    if (safeData.isGnosisSafe && !collateralToFree.isZero()) {
        txData.gasLimit = BigNumber.from('865000')
    }
    const tx =
        safeData.isGnosisSafe && !collateralToFree.isZero() ? txData : await handlePreTxGasEstimate(signer, txData)

    const txResponse = await signer.sendTransaction(tx)
    return txResponse
}

// export const handleCollectETH = async (signer: JsonRpcSigner, safe: ISafe) => {
//     if (!signer || !safe) {
//         return false
//     }
//     const { id: safeId, internalCollateralBalance } = safe

//     if (!safeId) {
//         throw new Error('No safe Id')
//     }
//     if (!internalCollateralBalance) {
//         throw new Error('No safe internalCollateralBalance')
//     }

//     const internalCollateralBalanceBN = ethersUtils.parseEther(
//         internalCollateralBalance
//     )

//     if (internalCollateralBalanceBN.isZero()) {
//         throw new Error('internalCollateralBalance is zero')
//     }

//     const geb = new Geb(ETH_NETWORK, signer)

//     const proxy = await geb.getProxyAction(signer._address)

//     let txData
//     // txData = await proxy.exitETH(safeId, internalCollateralBalanceBN)

//     if (!txData) throw new Error('No transaction request!')

//     const tx = await handlePreTxGasEstimate(signer, txData)

//     const txResponse = await signer.sendTransaction(tx)
//     return txResponse
// }
