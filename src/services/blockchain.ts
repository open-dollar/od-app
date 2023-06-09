import { BigNumber, ethers, utils as ethersUtils } from 'ethers'
import { Geb, TransactionRequest, utils as gebUtils } from 'geb.js'
import { JsonRpcSigner } from '@ethersproject/providers/lib/json-rpc-provider'
import { IAuctionBid, ISafe, ISafeData } from '../utils/interfaces'
import { ETH_NETWORK } from '../utils/constants'
import { handlePreTxGasEstimate } from '../hooks/TransactionHooks'
import { callAbi, callBytecode } from './abi'
import { toFixedString } from '../utils/helper'

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

    const geb = new Geb(ETH_NETWORK, signer.provider)

    const proxy = await geb.getProxyAction(signer._address)

    let txData: TransactionRequest = {}

    if (safeId) {
        if (collateralBN.isZero() && !debtBN.isZero()) {
            txData = proxy.generateDebt(safeId, debtBN)
        } else if (!collateralBN.isZero() && debtBN.isZero()) {
            txData = proxy.lockETH(collateralBN, safeId)
        } else {
            txData = proxy.lockETHAndGenerateDebt(collateralBN, safeId, debtBN)
        }
    } else {
        txData = proxy.openLockETHAndGenerateDebt(
            collateralBN,
            gebUtils.ETH_A,
            debtBN
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

    const geb = new Geb(ETH_NETWORK, signer.provider)

    const totalDebtBN = ethersUtils.parseEther(safeData.totalDebt)
    const totalCollateralBN = ethersUtils.parseEther(safeData.totalCollateral)
    const ethToFree = ethersUtils.parseEther(safeData.leftInput)
    const raiToRepay = ethersUtils.parseEther(safeData.rightInput)
    const proxy = await geb.getProxyAction(signer._address)

    let txData: TransactionRequest = {}

    if (
        !ethToFree.isZero() &&
        !raiToRepay.isZero() &&
        totalCollateralBN.isZero() &&
        totalDebtBN.isZero()
    ) {
        txData = proxy.repayAllDebtAndFreeETH(safeId, ethToFree)
    } else if (
        ethToFree.isZero() &&
        totalDebtBN.isZero() &&
        !raiToRepay.isZero()
    ) {
        txData = proxy.repayAllDebt(safeId)
    } else if (ethToFree.isZero() && !raiToRepay.isZero()) {
        txData = proxy.repayDebt(safeId, raiToRepay)
    } else if (!ethToFree.isZero() && raiToRepay.isZero()) {
        txData = proxy.freeETH(safeId, ethToFree)
    } else {
        txData = proxy.repayDebtAndFreeETH(safeId, ethToFree, raiToRepay)
    }

    if (!txData) throw new Error('No transaction request!')

    if (safeData.isGnosisSafe && !ethToFree.isZero()) {
        txData.gasLimit = BigNumber.from('865000')
    }
    const tx =
        safeData.isGnosisSafe && !ethToFree.isZero()
            ? txData
            : await handlePreTxGasEstimate(signer, txData)

    const txResponse = await signer.sendTransaction(tx)
    return txResponse
}

export const handleCollectETH = async (signer: JsonRpcSigner, safe: ISafe) => {
    if (!signer || !safe) {
        return false
    }
    const { id: safeId, internalCollateralBalance } = safe

    if (!safeId) {
        throw new Error('No safe Id')
    }
    if (!internalCollateralBalance) {
        throw new Error('No safe internalCollateralBalance')
    }

    const internalCollateralBalanceBN = ethersUtils.parseEther(
        internalCollateralBalance
    )

    if (internalCollateralBalanceBN.isZero()) {
        throw new Error('internalCollateralBalance is zero')
    }

    const geb = new Geb(ETH_NETWORK, signer.provider)

    const proxy = await geb.getProxyAction(signer._address)

    const txData = proxy.exitETH(safeId, internalCollateralBalanceBN)

    if (!txData) throw new Error('No transaction request!')

    const tx = await handlePreTxGasEstimate(signer, txData)

    const txResponse = await signer.sendTransaction(tx)
    return txResponse
}

export const handleAuctionBid = async ({
    signer,
    amount,
    auctionId,
    auctionType,
}: IAuctionBid) => {
    if (!signer || !auctionId || !amount) {
        return false
    }
    const geb = new Geb(ETH_NETWORK, signer.provider)
    const proxy = await geb.getProxyAction(signer._address)

    const amountBN = ethersUtils.parseEther(amount)

    let txData

    if (auctionType === 'DEBT') {
        txData = proxy.debtAuctionDecreaseSoldAmount(amountBN, auctionId)
    }
    if (auctionType === 'SURPLUS') {
        txData = proxy.surplusIncreaseBidSize(amountBN, auctionId)
    }
    if (auctionType === 'STAKED_TOKEN') {
        const radAmount = BigNumber.from(toFixedString(amount, 'RAD'))
        txData = proxy.stakedTokenAuctionIncreaseBidSize(radAmount, auctionId)
    }

    if (!txData) throw new Error('No transaction request!')
    let tx = await handlePreTxGasEstimate(signer, txData)
    const txResponse = await signer.sendTransaction(tx)
    return txResponse
}

export const handleAuctionClaim = async ({
    signer,
    auctionId,
    auctionType,
}: IAuctionBid) => {
    if (!signer || !auctionId || !auctionType) {
        return false
    }

    const geb = new Geb(ETH_NETWORK, signer.provider)
    const proxy = await geb.getProxyAction(signer._address)
    let txData

    if (auctionType === 'DEBT') {
        txData = proxy.debtAuctionSettleAuction(auctionId)
    }
    if (auctionType === 'SURPLUS') {
        txData = proxy.surplusSettleAuction(auctionId)
    }
    if (auctionType === 'STAKED_TOKEN') {
        txData = proxy.stakedTokenSettleAuction(auctionId)
    }

    if (!txData) throw new Error('No transaction request!')
    const tx = await handlePreTxGasEstimate(signer, txData)
    const txResponse = await signer.sendTransaction(tx)
    return txResponse
}

export const handleClaimInternalBalance = async ({
    signer,
    type,
    amount,
}: IAuctionBid) => {
    if (!signer) {
        return false
    }

    const geb = new Geb(ETH_NETWORK, signer.provider)
    const proxy = await geb.getProxyAction(signer._address)
    let txData
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
                geb.contracts.protocolToken.transfer(signer._address, amountBN)
                    .data
            )
        ).data

        txData = proxy.proxy.execute__BytesBytes(
            0,
            callBytecode,
            data as ethers.BytesLike
        )
    } else {
        txData = proxy.exitAllCoin()
    }

    if (!txData) throw new Error('No transaction request!')
    const gasLimit = type && amount ? '150000' : null
    const tx = await handlePreTxGasEstimate(signer, txData, gasLimit)
    const txResponse = await signer.sendTransaction(tx)
    return txResponse
}
