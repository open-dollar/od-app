import { useCallback, useEffect, useMemo, useState } from 'react'
import { utils as gebUtils } from '@opendollar/sdk'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { BigNumber, ethers, constants } from 'ethers'
import _ from '~/utils/lodash'

import { useStoreActions, useStoreState } from '~/store'
import { COIN_TICKER, formatNumber, sanitizeDecimals, toFixedString } from '~/utils'
import DecimalInput from '~/components/DecimalInput'
import Button from '~/components/Button'

const AuctionsPayment = () => {
    const { t } = useTranslation()
    const [value, setValue] = useState('')
    const [collateralValue, setCollateralValue] = useState('')
    const [error, setError] = useState('')
    const {
        auctionModel: auctionsState,
        popupsModel: popupsState,
        connectWalletModel: connectWalletState,
    } = useStoreState((state) => state)
    const { auctionModel: auctionsActions, popupsModel: popupsActions } = useStoreActions((state) => state)

    const {
        selectedAuction: surplusOrDebtAuction,
        selectedCollateralAuction,
        amount,
        coinBalances,
        internalBalance,
        protInternalBalance,
    } = auctionsState

    const selectedAuction = surplusOrDebtAuction ? surplusOrDebtAuction : selectedCollateralAuction

    const sectionType = popupsState.auctionOperationPayload.auctionType
    const isSettle = popupsState.auctionOperationPayload.type.includes('settle')
    const isBid = popupsState.auctionOperationPayload.type.includes('bid')
    const isClaim = popupsState.auctionOperationPayload.type.includes('claim')
    const isBuyCollateral = popupsState.auctionOperationPayload.type.includes('buy')

    const tokenSymbol = _.get(selectedAuction, 'tokenSymbol', undefined)
    const auctionType = _.get(selectedAuction, 'englishAuctionType', 'DEBT')
    const buyInitialAmount = _.get(selectedAuction, 'buyInitialAmount', '0')
    const sellInitialAmount = _.get(selectedAuction, 'sellInitialAmount', '0')
    const bids = _.get(selectedAuction, 'englishAuctionBids', '[]')
    const biddersList = _.get(selectedAuction, 'biddersList', '[]')
    const remainingCollateral = _.get(selectedAuction, 'remainingCollateral', '0')
    const remainingToRaise = _.get(selectedAuction, 'remainingToRaiseE18', '0')

    const sellAmount = _.get(selectedAuction, 'sellAmount', '0')
    const buyAmount = _.get(selectedAuction, 'buyAmount', '0')

    const buyToken = _.get(selectedAuction, 'buyToken', 'COIN')
    const sellToken = _.get(selectedAuction, 'sellToken', 'PROTOCOL_TOKEN')
    const auctionId = _.get(selectedAuction, 'auctionId', 1)

    // const bidIncrease: string = _.get(selectedAuction, 'englishAuctionConfiguration.bidIncrease', '1')
    const bidIncreaseBN = _.get(
        auctionsState,
        'auctionsData.surplusAuctionHouseParams.bidIncrease',
        '1010000000000000000'
    )
    const bidIncrease: string = ethers.utils.formatEther(bidIncreaseBN)
    // const debt_amountSoldIncrease: string = _.get(
    //     selectedAuction,
    //     'englishAuctionConfiguration.DEBT_amountSoldIncrease',
    //     '1'
    // )
    const bidDecreseBN = _.get(auctionsState, 'auctionsData.debtAuctionHouseParams.bidDecrease', '1050000000000000000')
    const debt_amountSoldIncrease: string = ethers.utils.formatEther(bidDecreseBN)

    const auctionDeadline = _.get(selectedAuction, 'auctionDeadline', '')
    const isOngoingAuction = auctionDeadline ? Number(auctionDeadline) * 1000 > Date.now() : false

    const odBalance = _.get(coinBalances, 'od', '0')
    const odgBalance = _.get(coinBalances, 'odg', '0')
    const odAllowance = _.get(connectWalletState, 'coinAllowance', '0')
    const odgAllowance = _.get(connectWalletState, 'protAllowance', '0')

    const buySymbol = buyToken === 'COIN' ? COIN_TICKER : 'ODG'
    const sellSymbol = sellToken === 'COIN' ? COIN_TICKER : 'ODG'

    const collateralPrice = useMemo(() => {
        if (auctionsState.collateralData) {
            const data = auctionsState.collateralData.filter((item) => item._auctionId.toString() === auctionId)
            const price = data[0]?._boughtCollateral.mul(constants.WeiPerEther).div(data[0]._adjustedBid)

            // we divide by 1e18 because we multiplied by 1e18 in the line above
            // this was required to handle decimal prices (<0)
            return price
        }
        return BigNumber.from('0')
    }, [auctionId, auctionsState.collateralData])

    const collateralPriceFormatted = ethers.utils.formatUnits(collateralPrice || constants.WeiPerEther, 18)

    const handleAmountChange = (val: string) => {
        setError('')
        setValue(val)
        auctionsActions.setAmount(val)
        const valBN = BigNumber.from(ethers.utils.parseEther(val || '0'))
        const colValueBN = valBN.mul(collateralPrice).div(constants.WeiPerEther)
        const colValueBNDecimalsRemoved = gebUtils.decimalShift(gebUtils.decimalShift(colValueBN, -8), 8)
        setCollateralValue(ethers.utils.formatEther(colValueBNDecimalsRemoved.toString()))
        auctionsActions.setCollateralAmount(ethers.utils.formatEther(colValueBNDecimalsRemoved.toString()))
    }

    const handleCollateralAmountChange = useCallback(
        (amount: string) => {
            setError('')
            setCollateralValue(amount)
            auctionsActions.setCollateralAmount(amount)

            const value = (Number(amount) / Number(collateralPriceFormatted)).toString() || ''
            setValue(sanitizeDecimals(value, 18))
            auctionsActions.setAmount(sanitizeDecimals(value, 18))
        },
        [auctionsActions, collateralPriceFormatted]
    )

    const maxBid = (): string => {
        const buyAmountBN = buyAmount ? BigNumber.from(toFixedString(buyAmount, 'WAD')) : BigNumber.from('0')
        const bidIncreaseBN = BigNumber.from(toFixedString(bidIncrease, 'WAD'))
        if (auctionType === 'DEBT') {
            const sellAmountBN = sellAmount ? BigNumber.from(toFixedString(sellAmount, 'WAD')) : BigNumber.from('0')
            if (bids.length === 0) {
                if (isOngoingAuction) {
                    // We need to bid N% less than the current best bid
                    return gebUtils
                        .wadToFixed(sellAmountBN.mul(100).div(bidDecreseBN).mul(gebUtils.WAD).div(100))
                        .toString()
                } else {
                    // TODO: check those calcs
                    // Auction restart (no bids and passed the dealine)
                    // When doing restart we're allowed to accept more FLX, DEBT_amountSoldIncrease=1.2
                    const numerator = sellAmountBN.mul(BigNumber.from(toFixedString(debt_amountSoldIncrease, 'WAD')))
                    return gebUtils.wadToFixed(numerator.div(bidIncreaseBN).mul(gebUtils.WAD)).toString()
                }
            } else {
                // We need to bid N% less than the current best bid
                return gebUtils
                    .wadToFixed(sellAmountBN.mul(100).div(bidDecreseBN).mul(gebUtils.WAD).div(100))
                    .toString()
            }
        }
        let amountToBuy =
            biddersList.length > 0 && buyAmountBN.isZero()
                ? BigNumber.from(toFixedString(biddersList[0].buyAmount, 'WAD'))
                : buyAmountBN

        const max = gebUtils.wadToFixed(amountToBuy.mul(bidIncreaseBN).div(gebUtils.WAD)).toString()

        return max
    }

    const maxAmount = (function () {
        if (auctionType === 'COLLATERAL') {
            const odToBidPlusOne = BigNumber.from(remainingToRaise).add(1)
            const odToBid = ethers.utils.formatUnits(odToBidPlusOne.toString(), 18)
            const odBalanceNumber = Number(odBalance)
            return odBalanceNumber < Number(odToBid) ? odBalance : odToBid.toString()
        } else {
            return maxBid()
        }
    })()

    const maxCollateral = BigNumber.from(ethers.utils.parseEther(maxAmount))
        .mul(collateralPrice)
        .div(constants.WeiPerEther)
    const maxCollateralParsed = ethers.utils.formatEther(maxCollateral)

    const passedChecks = () => {
        const maxBidAmountBN = BigNumber.from(toFixedString(maxBid(), 'WAD'))

        const valueBN = value ? BigNumber.from(toFixedString(value, 'WAD')) : BigNumber.from('0')

        const raiBalanceBN = odBalance ? BigNumber.from(toFixedString(odBalance, 'WAD')) : BigNumber.from('0')
        const flxBalanceBN = odgBalance ? BigNumber.from(toFixedString(odgBalance, 'WAD')) : BigNumber.from('0')
        const internalBalanceBN =
            internalBalance && Number(internalBalance) > 0.00001
                ? BigNumber.from(toFixedString(internalBalance, 'WAD'))
                : BigNumber.from('0')
        const flxInternalBalance =
            protInternalBalance && Number(protInternalBalance) > 0.00001
                ? BigNumber.from(toFixedString(protInternalBalance, 'WAD'))
                : BigNumber.from('0')

        const totalRaiBalance = raiBalanceBN.add(internalBalanceBN)
        const totalFlxBalance = flxBalanceBN.add(flxInternalBalance)

        const buyAmountBN = buyAmount ? BigNumber.from(toFixedString(buyAmount, 'WAD')) : BigNumber.from('0')

        if (valueBN.lt(BigNumber.from('0'))) {
            setError(`You cannot bid a negative number`)
            return false
        }
        if (valueBN.isZero()) {
            setError(`You cannot submit nothing`)
            return false
        }

        if (auctionType === 'SURPLUS') {
            if (buyAmountBN.gt(totalFlxBalance) || valueBN.gt(flxBalanceBN)) {
                setError(`Insufficient ODG balance.`)
                return false
            }

            if (bids.length > 0 && valueBN.lt(maxBidAmountBN)) {
                setError(`You need to bid ${((Number(bidIncrease) - 1) * 100).toFixed(0)}% more ODG vs the highest bid`)
                return false
            }
        }

        if (auctionType === 'DEBT') {
            if (buyAmountBN.gt(totalRaiBalance) || valueBN.gt(raiBalanceBN)) {
                setError(`Insufficient ${COIN_TICKER} balance.`)
                return false
            }

            if (!bids.length && valueBN.gt(maxBidAmountBN)) {
                setError(`You can only bid a maximum of ${maxBid()} ${sellSymbol}`)
                return false
            }

            if (bids.length > 0 && valueBN.gt(maxBidAmountBN)) {
                setError(
                    `You need to bid ${((Number(debt_amountSoldIncrease) - 1) * 100).toFixed(
                        0
                    )}% less ODG vs the lowest bid`
                )
                return false
            }
        }

        if (auctionType === 'COLLATERAL') {
            const odBalanceBN = ethers.utils.parseUnits(odBalance)
            const valueBN = value ? ethers.utils.parseUnits(value, 18) : BigNumber.from('0')
            const collateralAmountBN = collateralValue
                ? ethers.utils.parseUnits(collateralValue, 18)
                : BigNumber.from('0')

            // Collateral Error when you dont have enough balance
            if (buyAmountBN.gt(totalRaiBalance)) {
                setError(`Insufficient ${COIN_TICKER} balance.`)
                return false
            }

            if (valueBN.gt(odBalanceBN)) {
                setError(`Insufficient OD balance.`)
                return false
            }

            if (valueBN.lt(ethers.utils.parseUnits('101', 18))) {
                setError(`The minimum bid amount is 100 OD.`)
                return false
            }

            // Collateral Error when there is not enough collateral left to buy
            if (collateralAmountBN.gt(remainingCollateral)) {
                setError(
                    `Insufficient ${tokenSymbol} to buy. There is only ${Number(
                        ethers.utils.formatEther(remainingCollateral.toString())
                    )} ${tokenSymbol} left.`
                )
                return false
            }
        }

        return true
    }

    const hasAllowance = () => {
        let tempValue = value
        const odAllowanceBN = odAllowance ? BigNumber.from(toFixedString(odAllowance, 'WAD')) : BigNumber.from('0')
        const odgAllowanceBN = odgAllowance ? BigNumber.from(toFixedString(odgAllowance, 'WAD')) : BigNumber.from('0')

        if (auctionType === 'COLLATERAL') {
            const odAmountBN = amount ? BigNumber.from(toFixedString(amount, 'WAD')) : BigNumber.from('0')
            return odAllowanceBN.gte(odAmountBN)
        }

        if (auctionType === 'DEBT') {
            tempValue = buyAmount
        }
        const valueBN = tempValue ? BigNumber.from(toFixedString(tempValue, 'WAD')) : BigNumber.from('0')
        if (auctionType === 'SURPLUS') {
            return odgAllowanceBN.gte(valueBN)
        }
        return odAllowanceBN.gte(valueBN)
    }

    const handleSubmit = () => {
        if (isBuyCollateral) {
            if (passedChecks()) {
                if (hasAllowance()) {
                    auctionsActions.setOperation(2)
                } else {
                    auctionsActions.setOperation(1)
                }
                return
            }
            return
        }

        if (isBid) {
            if (passedChecks()) {
                if (hasAllowance()) {
                    auctionsActions.setOperation(2)
                } else {
                    auctionsActions.setOperation(1)
                }
            }
            return
        }

        if (sectionType === 'DEBT') {
            auctionsActions.setOperation(2)
        } else {
            auctionsActions.setAmount(protInternalBalance)
            auctionsActions.setOperation(2)
        }
    }

    const returnClaimValues = () => {
        const amount =
            Number(protInternalBalance) > Number(internalBalance)
                ? Number(protInternalBalance)
                : Number(internalBalance)
        const symbol = Number(protInternalBalance) > Number(internalBalance) ? 'ODG' : 'OD'
        return { amount, symbol }
    }

    const handleCancel = () => {
        popupsActions.setAuctionOperationPayload({
            isOpen: false,
            type: '',
            auctionType: '',
        })
        auctionsActions.setOperation(0)
        auctionsActions.setSelectedAuction(null)
        auctionsActions.setAmount('')
    }

    useEffect(() => {
        setValue(amount)
    }, [amount])

    const upperInput = (function () {
        switch (auctionType) {
            case 'DEBT':
                return { value: buyInitialAmount, label: `${buySymbol} to Bid` }
            case 'SURPLUS':
                return { value: sellInitialAmount, label: `${sellSymbol} to Receive` }
            case 'COLLATERAL':
                return {
                    value: collateralValue,
                    label: `${tokenSymbol} to Receive (Max: ${formatNumber(maxCollateralParsed, 4)} ${tokenSymbol})`,
                }
            default:
                return { value: '', label: '' }
        }
    })()

    const lowerInput = (function () {
        switch (auctionType) {
            case 'DEBT':
                return { value: value, label: `${sellSymbol} to Receive` }
            case 'SURPLUS':
                return { value: value, label: `${buySymbol} to Bid` }
            case 'COLLATERAL':
                return {
                    value: value,
                    label: `${buySymbol} to Bid (Max: ${formatNumber(maxAmount, 4)} ${buySymbol})`,
                }
            default:
                return { value: '', label: '' }
        }
    })()

    return (
        <Container>
            {!isSettle && !isClaim ? (
                <>
                    <DecimalInput
                        disabled={auctionType !== 'COLLATERAL'}
                        onChange={handleCollateralAmountChange}
                        value={upperInput.value}
                        label={upperInput.label}
                        disableMax
                    />
                    <MarginFixer />
                    <DecimalInput
                        onChange={handleAmountChange}
                        value={lowerInput.value}
                        label={lowerInput.label}
                        maxText={auctionType === 'DEBT' || auctionType === 'COLLATERAL' ? 'max' : 'min'}
                        disableMax={
                            auctionType !== 'COLLATERAL' ? Number(buyAmount) === 0 || Number(sellAmount) === 0 : false
                        }
                        handleMaxClick={() => handleAmountChange(maxAmount)}
                    />
                </>
            ) : (
                <DecimalInput
                    disabled
                    onChange={() => {}}
                    value={
                        isClaim
                            ? Number(returnClaimValues().amount) < 0.0001
                                ? '< 0.0001'
                                : returnClaimValues().amount
                            : sellAmount
                    }
                    label={`Claimable ${isClaim ? returnClaimValues().symbol : sellSymbol}`}
                />
            )}
            <Error>{error}</Error>
            <Footer>
                <Button dimmed text={t('cancel')} onClick={handleCancel} />
                <Button primary onClick={handleSubmit} text={t('review_transaction')} />
            </Footer>
        </Container>
    )
}

export default AuctionsPayment

const Container = styled.div`
    padding: 20px;
`

const MarginFixer = styled.div`
    margin-top: 20px;
`

const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 25px;
    button {
        width: 300px;
    }
`

const Error = styled.p`
    color: ${(props) => props.theme.colors.error};
    font-size: ${(props) => props.theme.font.xSmall};
    font-weight: 600;
    width: 100%;
    margin: 16px 0;
    height: 20px;
`
