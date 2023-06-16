import { JsonRpcSigner } from '@ethersproject/providers/lib/json-rpc-provider'
import { Geb, TransactionRequest, utils as gebUtils } from '@hai-on-op/sdk'
import { BigNumber, ethers, utils as ethersUtils } from 'ethers'
import { handlePreTxGasEstimate } from '../hooks/TransactionHooks'
import { ETH_NETWORK } from '../utils/constants'
import { IAuctionBid, ISafeData } from '../utils/interfaces'
import { callAbi, callBytecode } from './abi'

export const handleDepositAndBorrow = async (
    signer: JsonRpcSigner,
    safeData: ISafeData,
    safeId = ''
) => {
    if (!signer || !safeData) {
        return false
    }

    const collateralBN = safeData.leftInput
        ? ethersUtils.parseEther(safeData.leftInput)
        : ethersUtils.parseEther('0')
    const debtBN = safeData.rightInput
        ? ethersUtils.parseEther(safeData.rightInput)
        : ethersUtils.parseEther('0')

    const geb = new Geb(ETH_NETWORK, signer)

    const proxy = await geb.getProxyAction(signer._address)

    let txData: TransactionRequest = {}

    if (safeId) {
        if (collateralBN.isZero() && !debtBN.isZero()) {
            txData = await proxy.generateDebt(safeId, debtBN)
        } else if (!collateralBN.isZero() && debtBN.isZero()) {
            txData = await proxy.lockTokenCollateral(safeData.collateral, safeId, collateralBN, true)
        } else {
            txData = await proxy.lockTokenCollateralAndGenerateDebt(safeData.collateral, safeId, collateralBN, debtBN, true)
        }
    } else {
        txData = await proxy.openLockTokenCollateralAndGenerateDebt(
            safeData.collateral,
            collateralBN,
            debtBN,
            true
        )
    }

    if (!txData) throw new Error('No transaction request!')

    const tx = await handlePreTxGasEstimate(
        signer,
        txData,
        safeId ? null : '865000'
    )

    const txResponse = await signer.sendTransaction(tx)
    return txResponse
}

export const handleRepayAndWithdraw = async (
    signer: JsonRpcSigner,
    safeData: ISafeData,
    safeId: string
) => {
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

    if (
        !collateralToFree.isZero() &&
        !haiToRepay.isZero() &&
        totalCollateralBN.isZero() &&
        totalDebtBN.isZero()
    ) {
        txData = await proxy.repayAllDebtAndFreeTokenCollateral(safeData.collateral, safeId, collateralToFree)
    } else if (
        collateralToFree.isZero() &&
        totalDebtBN.isZero() &&
        !haiToRepay.isZero()
    ) {
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
        safeData.isGnosisSafe && !collateralToFree.isZero()
            ? txData
            : await handlePreTxGasEstimate(signer, txData)

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

export const handleClaimInternalBalance = async ({
    signer,
    type,
    amount,
}: IAuctionBid) => {
    if (!signer) {
        return false
    }

    const geb = new Geb(ETH_NETWORK, signer)
    const proxy = await geb.getProxyAction(signer._address)
    let txData: ethers.PopulatedTransaction;
    if (type && amount) {
        const amountBN = ethersUtils.parseEther(amount)
        const call = new ethers.Contract(
            gebUtils.NULL_ADDRESS,
            callAbi,
            signer.provider
        )
        const data = (
            await call.populateTransaction.call(
                geb.contracts.protocolToken.address,
                (await geb.contracts.protocolToken.populateTransaction.transfer(signer._address, amountBN)).data
            )
        ).data

        txData = await proxy.proxy.populateTransaction['execute(bytes,bytes)'](
            callBytecode,
            data as ethers.BytesLike
        )
    } else {
        txData = await proxy.exitAllCoin()
    }

    if (!txData) throw new Error('No transaction request!')
    const gasLimit = type && amount ? '150000' : null
    const tx = await handlePreTxGasEstimate(signer, txData, gasLimit)
    const txResponse = await signer.sendTransaction(tx)
    return txResponse
}
