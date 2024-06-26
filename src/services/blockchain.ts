import { JsonRpcSigner } from '@ethersproject/providers/lib/json-rpc-provider'
import { Geb, TransactionRequest } from '@opendollar/sdk'
import { BigNumber, ethers, utils as ethersUtils } from 'ethers'

import { handlePreTxGasEstimate } from '~/hooks'
import { ISafeData } from '~/utils'

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

export const handleDepositAndBorrow = async (signer: JsonRpcSigner, safeData: ISafeData, safeId = '', geb: Geb) => {
    if (!signer || !safeData) {
        return false
    }

    const collateralBN = safeData.leftInput ? ethersUtils.parseEther(safeData.leftInput) : ethersUtils.parseEther('0')
    const debtBN = safeData.rightInput ? ethersUtils.parseEther(safeData.rightInput) : ethersUtils.parseEther('0')

    const proxy = await geb.getProxyAction(signer._address)

    let txData: TransactionRequest = {}

    if (safeId) {
        if (collateralBN.isZero() && !debtBN.isZero()) {
            txData = await proxy.generateDebt(safeId, debtBN)
        } else if (!collateralBN.isZero() && debtBN.isZero()) {
            txData = await proxy.lockTokenCollateral(safeData.collateral, safeId, collateralBN)
        } else {
            txData = await proxy.lockTokenCollateralAndGenerateDebt(safeData.collateral, safeId, collateralBN, debtBN)
        }
    } else {
        txData = await proxy.openLockTokenCollateralAndGenerateDebt(safeData.collateral, collateralBN, debtBN)
    }

    if (!txData) throw new Error('No transaction request!')

    const tx = await handlePreTxGasEstimate(signer, txData, safeId ? null : '865000')

    const txResponse = await signer.sendTransaction(tx)
    return txResponse
}

export const handleRepayAndWithdraw = async (signer: JsonRpcSigner, safeData: ISafeData, safeId: string, geb: Geb) => {
    if (!signer || !safeData || !geb) {
        return false
    }
    if (!safeId) throw new Error('No safe Id')

    const totalDebtBN = ethersUtils.parseEther(safeData.totalDebt)
    const totalCollateralBN = ethersUtils.parseEther(safeData.totalCollateral)
    const collateralToFree = ethersUtils.parseEther(safeData.leftInput)
    const haiToRepay = ethersUtils.parseEther(safeData.rightInput)
    const proxy = await geb.getProxyAction(signer._address)

    let txData: TransactionRequest = {}

    if (!collateralToFree.isZero() && !haiToRepay.isZero() && totalCollateralBN.isZero() && totalDebtBN.isZero()) {
        txData = await proxy.repayAllDebtAndFreeTokenCollateral(safeData.collateral, safeId, collateralToFree)
    } else if (collateralToFree.isZero() && totalDebtBN.isZero() && !haiToRepay.isZero()) {
        txData = await proxy.repayAllDebtAndFreeTokenCollateral(safeData.collateral, safeId, BigNumber.from('0'))
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
