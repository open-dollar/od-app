import React, { useEffect, useState } from 'react'
import { utils as gebUtils } from 'geb.js'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Button from '../Button'
import DecimalInput from '../DecimalInput'
import Results from './Results'
import { useStoreActions, useStoreState } from '../../store'
import _ from '../../utils/lodash'
import { COIN_TICKER } from '../../utils/constants'
import { BigNumber } from 'ethers'
import { formatNumber, toFixedString } from '../../utils/helper'
import { parseWad } from '../../utils/gebManager'

const AuctionsPayment = () => {
    const { t } = useTranslation()
    const [value, setValue] = useState('')
    const [error, setError] = useState('')

    const {
        auctionsModel: auctionsState,
        popupsModel: popupsState,
        connectWalletModel: connectWalletState,
    } = useStoreState((state) => state)
    const { auctionsModel: auctionsActions, popupsModel: popupsActions } =
        useStoreActions((state) => state)
    const {
        selectedAuction,
        amount,
        coinBalances,
        internalBalance,
        protInternalBalance,
    } = auctionsState

    const sectionType = popupsState.auctionOperationPayload.auctionType
    const isSettle = popupsState.auctionOperationPayload.type.includes('settle')
    const isBid = popupsState.auctionOperationPayload.type.includes('bid')
    const isClaim = popupsState.auctionOperationPayload.type.includes('claim')

    const auctionType = _.get(selectedAuction, 'englishAuctionType', 'DEBT')
    const buyInitialAmount = _.get(selectedAuction, 'buyInitialAmount', '0')
    const sellInitialAmount = _.get(selectedAuction, 'sellInitialAmount', '0')
    const bids = _.get(selectedAuction, 'englishAuctionBids', '[]')
    const biddersList = _.get(selectedAuction, 'biddersList', '[]')

    const sellAmount = _.get(selectedAuction, 'sellAmount', '0')
    const buyAmount = _.get(selectedAuction, 'buyAmount', '0')

    const buyToken = _.get(selectedAuction, 'buyToken', 'COIN')
    const sellToken = _.get(selectedAuction, 'sellToken', 'PROTOCOL_TOKEN')
    const bidIncrease: string = _.get(
        selectedAuction,
        'englishAuctionConfiguration.bidIncrease',
        '1'
    )
    const debt_amountSoldIncrease: string = _.get(
        selectedAuction,
        'englishAuctionConfiguration.DEBT_amountSoldIncrease',
        '1'
    )
    const auctionDeadline = _.get(selectedAuction, 'auctionDeadline', '')
    const isOngoingAuction = auctionDeadline
        ? Number(auctionDeadline) * 1000 > Date.now()
        : false

    const raiBalance = _.get(coinBalances, 'rai', '0')
    const flxBalance = _.get(coinBalances, 'flx', '0')
    const raiAllowance = _.get(connectWalletState, 'coinAllowance', '0')
    const flxAllowance = _.get(connectWalletState, 'protAllowance', '0')

    const buySymbol =
        buyToken === 'PROTOCOL_TOKEN_LP'
            ? 'FLX/ETH LP'
            : buyToken === 'COIN'
            ? COIN_TICKER
            : 'FLX'
    const sellSymbol =
        sellToken === 'PROTOCOL_TOKEN_LP'
            ? 'FLX/ETH LP'
            : sellToken === 'COIN'
            ? COIN_TICKER
            : 'FLX'

    const handleAmountChange = (val: string) => {
        setError('')
        setValue(val)
        auctionsActions.setAmount(val)
    }

    const parseRadToWad = (amount: string) => {
        return BigNumber.from(
            toFixedString(
                parseWad(gebUtils.decimalShift(BigNumber.from(amount), -9)),
                'WAD'
            )
        )
    }

    const maxBid = (): string => {
        const buyAmountBN = buyAmount
            ? auctionType === 'STAKED_TOKEN'
                ? parseRadToWad(buyAmount)
                : BigNumber.from(toFixedString(buyAmount, 'WAD'))
            : BigNumber.from('0')
        const bidIncreaseBN = BigNumber.from(toFixedString(bidIncrease, 'WAD'))
        if (auctionType === 'DEBT') {
            const sellAmountBN = sellAmount
                ? BigNumber.from(toFixedString(sellAmount, 'WAD'))
                : BigNumber.from('0')
            if (bids.length === 0) {
                if (isOngoingAuction) {
                    // We need to bid 3% less than the current best bid
                    return gebUtils
                        .wadToFixed(
                            sellAmountBN.div(bidIncreaseBN).mul(gebUtils.WAD)
                        )
                        .toString()
                } else {
                    // Auction restart (no bids and passed the dealine)
                    // When doing restart we're allowed to accept more FLX, DEBT_amountSoldIncrease=1.2
                    const numerator = sellAmountBN.mul(
                        BigNumber.from(
                            toFixedString(debt_amountSoldIncrease, 'WAD')
                        )
                    )
                    return gebUtils
                        .wadToFixed(
                            numerator.div(bidIncreaseBN).mul(gebUtils.WAD)
                        )
                        .toString()
                }
            } else {
                // We need to bid 3% less than the current best bid
                return gebUtils
                    .wadToFixed(
                        sellAmountBN.div(bidIncreaseBN).mul(gebUtils.WAD)
                    )
                    .toString()
            }
        }

        let amountToBuy =
            biddersList.length > 0 && buyAmountBN.isZero()
                ? BigNumber.from(toFixedString(biddersList[0].buyAmount, 'WAD'))
                : buyAmountBN

        const max = gebUtils
            .wadToFixed(amountToBuy.mul(bidIncreaseBN).div(gebUtils.WAD))
            .toString()

        if (auctionType === 'STAKED_TOKEN') {
            return formatNumber(
                (Number(max) + 0.0001).toString(),
                4,
                true
            ).toString()
        }

        return max
    }

    const passedChecks = () => {
        const maxBidAmountBN = BigNumber.from(toFixedString(maxBid(), 'WAD'))

        const valueBN = value
            ? BigNumber.from(toFixedString(value, 'WAD'))
            : BigNumber.from('0')

        const raiBalanceBN = raiBalance
            ? BigNumber.from(toFixedString(raiBalance, 'WAD'))
            : BigNumber.from('0')
        const flxBalanceBN = flxBalance
            ? BigNumber.from(toFixedString(flxBalance, 'WAD'))
            : BigNumber.from('0')
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

        const buyAmountBN = buyAmount
            ? auctionType === 'STAKED_TOKEN'
                ? parseRadToWad(buyAmount)
                : BigNumber.from(toFixedString(buyAmount, 'WAD'))
            : BigNumber.from('0')

        if (valueBN.lt(BigNumber.from('0'))) {
            setError(`You cannot bid a negative number`)
            return false
        }
        if (valueBN.isZero()) {
            setError(`You cannot submit nothing`)
            return false
        }

        if (auctionType === 'STAKED_TOKEN') {
            if (buyAmountBN.gt(totalRaiBalance) || valueBN.gt(raiBalanceBN)) {
                setError(`Insufficient ${COIN_TICKER} balance.`)
                return false
            }

            if (bids.length > 0 && valueBN.lt(maxBidAmountBN)) {
                setError(
                    `You need to bid ${(
                        (Number(bidIncrease) - 1) *
                        100
                    ).toFixed(0)}% more RAI vs the highest bid`
                )
                return false
            }
        }

        if (auctionType === 'SURPLUS') {
            if (buyAmountBN.gt(totalFlxBalance) || valueBN.gt(flxBalanceBN)) {
                setError(`Insufficient FLX balance.`)
                return false
            }

            if (bids.length > 0 && valueBN.lt(maxBidAmountBN)) {
                setError(
                    `You need to bid ${(
                        (Number(bidIncrease) - 1) *
                        100
                    ).toFixed(0)}% more FLX vs the highest bid`
                )
                return false
            }
        }

        if (auctionType === 'DEBT') {
            if (buyAmountBN.gt(totalRaiBalance) || valueBN.gt(raiBalanceBN)) {
                setError(`Insufficient ${COIN_TICKER} balance.`)
                return false
            }

            if (!bids.length && valueBN.gt(maxBidAmountBN)) {
                setError(
                    `You can only bid a maximum of ${maxBid()} ${sellSymbol}`
                )
                return false
            }

            if (bids.length > 0 && valueBN.gt(maxBidAmountBN)) {
                setError(
                    `You need to bid ${(
                        (Number(bidIncrease) - 1) *
                        100
                    ).toFixed(0)}% less FLX vs the lowest bid`
                )
                return false
            }
        }

        return true
    }
    const hasAllowance = () => {
        const raiAllowanceBN = raiAllowance
            ? BigNumber.from(toFixedString(raiAllowance, 'WAD'))
            : BigNumber.from('0')
        const flxAllowanceBN = flxAllowance
            ? BigNumber.from(toFixedString(flxAllowance, 'WAD'))
            : BigNumber.from('0')
        const valueBN = value
            ? BigNumber.from(toFixedString(value, 'WAD'))
            : BigNumber.from('0')
        if (auctionType === 'SURPLUS') {
            return flxAllowanceBN.gte(valueBN)
        }

        return raiAllowanceBN.gte(valueBN)
    }

    const handleSubmit = () => {
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
        if (sectionType === 'DEBT' || sectionType === 'STAKED_TOKEN') {
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
        const symbol =
            Number(protInternalBalance) > Number(internalBalance)
                ? 'FLX'
                : 'RAI'
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

    return (
        <Container>
            {!isSettle && !isClaim ? (
                <>
                    <DecimalInput
                        disabled
                        onChange={() => {}}
                        value={
                            auctionType === 'DEBT'
                                ? buyInitialAmount
                                : sellInitialAmount
                        }
                        label={
                            auctionType === 'DEBT'
                                ? `${buySymbol} to Bid`
                                : `${sellSymbol} to Receive`
                        }
                    />
                    <MarginFixer />
                    <DecimalInput
                        onChange={handleAmountChange}
                        value={value}
                        label={
                            auctionType === 'DEBT'
                                ? `${sellSymbol} to Receive`
                                : `${buySymbol} to Bid`
                        }
                        maxText={auctionType === 'DEBT' ? 'max' : 'min'}
                        disableMax={
                            Number(buyAmount) === 0 || Number(sellAmount) === 0
                        }
                        handleMaxClick={() => handleAmountChange(maxBid())}
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
                    label={`Claimable ${
                        isClaim ? returnClaimValues().symbol : sellSymbol
                    }`}
                />
            )}
            {error && <Error>{error}</Error>}
            <Results />
            <Footer>
                <Button dimmed text={t('cancel')} onClick={handleCancel} />
                <Button
                    withArrow
                    onClick={handleSubmit}
                    text={t('review_transaction')}
                />
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
    padding: 20px 0 0 0;
`

const Error = styled.p`
    color: ${(props) => props.theme.colors.dangerColor};
    font-size: ${(props) => props.theme.font.extraSmall};
    width: 100%;
    margin: 16px 0;
`
