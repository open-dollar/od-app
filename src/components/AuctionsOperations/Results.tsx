import { useMemo } from 'react'
import styled from 'styled-components'

import { useStoreState } from '~/store'
import { formatNumber, COIN_TICKER } from '~/utils'
import _ from '~/utils/lodash'

const Results = () => {
    const { auctionModel: auctionsState, popupsModel: popupsState } = useStoreState((state) => state)

    const {
        selectedAuction: surplusOrDebtAuction,
        selectedCollateralAuction,
        amount,
        internalBalance,
        protInternalBalance,
        collateralAmount,
    } = auctionsState
    const selectedAuction = surplusOrDebtAuction ? surplusOrDebtAuction : selectedCollateralAuction

    const buyInititalAmount = _.get(selectedAuction, 'buyInitialAmount', '0')
    const sellInitialAmount = _.get(selectedAuction, 'sellInitialAmount', '0')
    const auctionType = _.get(selectedAuction, 'englishAuctionType', 'DEBT')
    const auctionId = _.get(selectedAuction, 'auctionId', '')
    const buyToken = _.get(selectedAuction, 'buyToken', 'COIN')
    const sellToken = _.get(selectedAuction, 'sellToken', 'PROTOCOL_TOKEN')
    const sellAmount = _.get(selectedAuction, 'sellAmount', '0')
    const tokenSymbol = _.get(selectedAuction, 'tokenSymbol', undefined)

    const buySymbol = buyToken === 'PROTOCOL_TOKEN_LP' ? 'ODG/ETH LP' : buyToken === 'COIN' ? COIN_TICKER : 'ODG'
    const sellSymbol = sellToken === 'PROTOCOL_TOKEN_LP' ? 'ODG/ETH LP' : sellToken === 'COIN' ? COIN_TICKER : 'ODG'

    const isClaim = popupsState.auctionOperationPayload.type.includes('claim')
    const isSettle = popupsState.auctionOperationPayload.type.includes('settle')

    const leftOverBalance = useMemo(() => {
        const balance = Number(protInternalBalance) > Number(internalBalance) ? protInternalBalance : internalBalance
        return Number(balance) < 0.0001 ? '< 0.0001' : formatNumber(balance, 2)
    }, [internalBalance, protInternalBalance])

    const resultSection = (function () {
        switch (auctionType) {
            case 'DEBT':
                return {
                    firstLabel: `${buySymbol} to Bid`,
                    firstValue: buyInititalAmount,
                    secondLabel: `${sellSymbol} to Receive`,
                    secondValue: amount,
                }
            case 'SURPLUS':
                return {
                    firstLabel: `${sellSymbol} to Receive`,
                    firstValue: sellInitialAmount,
                    secondLabel: `${buySymbol} to Bid`,
                    secondValue: amount,
                }
            case 'COLLATERAL':
                return {
                    firstLabel: `${tokenSymbol} to Receive`,
                    firstValue: collateralAmount,
                    secondLabel: `${buySymbol} to Bid`,
                    secondValue: amount,
                }
            default:
                return { firstLabel: '', firstValue: '', secondLabel: '', secondValue: '' }
        }
    })()

    return (
        <Result>
            <Block>
                {isClaim ? (
                    <Item>
                        <Label>{`${
                            Number(protInternalBalance) > Number(internalBalance) ? 'ODG' : 'OD'
                        } Amount`}</Label>
                        <Value>{`${leftOverBalance}`}</Value>
                    </Item>
                ) : (
                    <>
                        <Item>
                            <Label>{`Auction #`}</Label>
                            <Value>{`${auctionId}`}</Value>
                        </Item>
                        {isSettle ? (
                            <Item>
                                <Label>{`Claimable ${sellSymbol}`}</Label>
                                <Value>{`${formatNumber(sellAmount, 2)}`}</Value>
                            </Item>
                        ) : (
                            <>
                                <Item>
                                    <Label>{resultSection.firstLabel}</Label>
                                    <Value>{`${formatNumber(
                                        resultSection.firstValue,
                                        auctionType === 'COLLATERAL' ? 4 : 2
                                    )}`}</Value>
                                </Item>
                                <Item>
                                    <Label>
                                        {auctionType === 'DEBT' ? `${sellSymbol} to Receive` : `${buySymbol} to Bid`}
                                    </Label>
                                    <Value>{`${formatNumber(amount, 2)}`}</Value>
                                </Item>
                            </>
                        )}
                    </>
                )}
            </Block>
        </Result>
    )
}

export default Results

const Result = styled.div`
    margin-top: 20px;
    border-radius: ${(props) => props.theme.global.borderRadius};
    border: 1px solid ${(props) => props.theme.colors.border};
    background: ${(props) => props.theme.colors.foreground};
`

const Block = styled.div`
    border-bottom: 1px solid;
    padding: 16px 20px;
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
    &:last-child {
        border-bottom: 0;
    }
`

const Item = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    &:last-child {
        margin-bottom: 0;
    }
`

const Label = styled.div`
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.secondary};
    letter-spacing: -0.09px;
    line-height: 21px;
`

const Value = styled.div`
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.primary};
    letter-spacing: -0.09px;
    line-height: 21px;
    font-weight: 600;
`
