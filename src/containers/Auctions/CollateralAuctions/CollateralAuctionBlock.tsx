import { BigNumber, constants, ethers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import _ from '~/utils/lodash'

import BidLine from '~/components/BidLine'
import { useActiveWeb3React } from '~/hooks'
import { useStoreActions, useStoreState } from '~/store'
import { ICollateralAuction } from '~/types'
import { COIN_TICKER, floatsTypes, formatDataNumber, formatNumber, parseWad } from '~/utils'
import Button from '~/components/Button'
import useAnalyticsData from '~/hooks/useAnalyticsData'
import { utils as gebUtils } from '@opendollar/sdk'

type Props = ICollateralAuction & { isCollapsed: boolean }

const CollateralAuctionBlock = (auction: Props) => {
    const { auctionId, isClaimed, remainingToRaiseE18, remainingCollateral, tokenSymbol, biddersList, isCollapsed } =
        auction

    const { account } = useActiveWeb3React()
    const { popupsModel: popupsActions, auctionModel: auctionActions } = useStoreActions((state) => state)

    const { connectWalletModel: connectWalletState, auctionModel: auctionsState } = useStoreState((state) => state)
    const {
        safeModel: { liquidationData },
    } = useStoreState((state) => state)

    const [collapse, setCollapse] = useState(isCollapsed)
    const analyticsData = useAnalyticsData()

    const [marketPriceOD, setMarketPriceOD] = useState(BigNumber.from('1'))

    const odBalance = gebUtils.decimalShift(BigNumber.from(auction.amountToRaise), floatsTypes.WAD - floatsTypes.RAD)

    useEffect(() => {
        if (analyticsData && analyticsData.marketPrice) {
            setMarketPriceOD(BigNumber.from(analyticsData.marketPrice.toString()))
        }
    }, [analyticsData])

    const buySymbol = COIN_TICKER

    const isOngoingAuction = BigNumber.from(remainingCollateral).gt('0') && BigNumber.from(remainingToRaiseE18).gt('0')

    const eventType = 'COLLATERAL'

    const userProxy = _.get(connectWalletState, 'proxyAddress', '')

    const parseWadAmount = (buyAmount: string) => {
        return parseWad(BigNumber.from(buyAmount))
    }

    const returnEventType = (i: number) => {
        if (i === biddersList.length - 1) {
            return 'Start'
        }
        return 'Buy'
    }

    const handleClick = (type: string) => {
        if (!account) {
            popupsActions.setIsConnectorsWalletOpen(true)
            return
        }

        if (!userProxy) {
            popupsActions.setIsProxyModalOpen(true)
            popupsActions.setReturnProxyFunction((storeActions: any) => {
                storeActions.popupsModel.setAuctionOperationPayload({
                    isOpen: true,
                    type,
                    auctionType: eventType,
                })
                storeActions.auctionsModel.setSelectedAuction(auction)
            })
            return
        }

        popupsActions.setAuctionOperationPayload({
            isOpen: true,
            type,
            auctionType: eventType,
        })
        auctionActions.setSelectedCollateralAuction(auction)
    }

    const returnBtn = () => {
        if (isOngoingAuction || !biddersList.length || (userProxy && !isClaimed)) {
            return (
                <BtnContainer>
                    <Button
                        primary
                        text={'Buy'}
                        disabled={auctionsState.isSubmitting || !(isOngoingAuction && userProxy)}
                        onClick={() => handleClick('buy')}
                    />
                </BtnContainer>
            )
        }
        return null
    }

    const collateralPrice = useMemo(() => {
        if (auctionsState.collateralData) {
            const data = auctionsState.collateralData.filter((item) => item._auctionId.toString() === auctionId)
            const price = data[0]?._boughtCollateral
                .mul(constants.WeiPerEther)
                .div(data[0]._adjustedBid.gt(0) ? data[0]._adjustedBid : 1)

            // we divide by 1e18 because we multiplied by 1e18 in the line above
            // this was required to handle decimal prices (<0)
            return price
        }
        return BigNumber.from('0')
    }, [auctionId, auctionsState.collateralData])

    let maxCollateral
    let maxCollateralParsed
    if (collateralPrice) {
        maxCollateral = BigNumber.from(remainingCollateral)
        maxCollateralParsed = ethers.utils.formatEther(maxCollateral)
    }

    function calculateAuctionEnd() {
        // @ts-ignore
        const auctionDeadlineUnix = auction?.auctionDeadline
        const date = new Date(auctionDeadlineUnix * 1000)
        const options = {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            year: 'numeric',
        }
        // @ts-ignore
        return date.toLocaleString('en-US', options)
    }

    const auctionDateString = calculateAuctionEnd()

    let auctionPrice =
        maxCollateral && maxCollateral.gt(BigNumber.from('0'))
            ? BigNumber.from(odBalance).mul(BigNumber.from(marketPriceOD)).div(maxCollateral)
            : BigNumber.from('0')

    const collateralLiquidationData = liquidationData ? liquidationData!.collateralLiquidationData[tokenSymbol] : null

    const calculateAuctionDiscount = () => {
        let marketPriceCollateral = collateralLiquidationData ? collateralLiquidationData!.currentPrice.value : '1'
        const decimalAuctionPrice = ethers.utils.formatEther(auctionPrice)
        const quotient = Number(decimalAuctionPrice) / Number(marketPriceCollateral ? marketPriceCollateral : '1')
        return (1 - quotient) * 100
    }

    const auctionDiscount = calculateAuctionDiscount()

    return (
        <Container>
            <Header onClick={() => setCollapse(!collapse)}>
                <LeftAucInfo type={eventType.toLowerCase()}>{`Auction #${auctionId}`}</LeftAucInfo>

                <RightAucInfo>
                    <InfoContainer>
                        <Info>
                            <InfoCol>
                                <InfoLabel>AVAILABLE</InfoLabel>
                                <InfoValue>{`${formatNumber(maxCollateralParsed || '0', 4)} ${tokenSymbol}`}</InfoValue>
                            </InfoCol>
                            <InfoCol>
                                <InfoLabel>MARKET PRICE</InfoLabel>
                                <InfoValue>{`${
                                    '$' +
                                    formatNumber(
                                        collateralLiquidationData
                                            ? collateralLiquidationData!.currentPrice.value.toString()
                                            : '0'
                                    )
                                }`}</InfoValue>
                            </InfoCol>
                            <InfoCol>
                                <InfoLabel>AUCTION PRICE</InfoLabel>
                                <InfoValue>
                                    {`${formatDataNumber(auctionPrice ? auctionPrice.toString() : '0', 18, 2, true)}`}
                                </InfoValue>
                            </InfoCol>
                            <InfoCol>
                                <InfoLabel>DISCOUNT</InfoLabel>
                                <InfoValue>
                                    {`${formatNumber(auctionDiscount ? auctionDiscount.toString() : '0', 3)}%`}
                                </InfoValue>
                            </InfoCol>
                            <InfoCol>
                                <InfoLabel>ENDS</InfoLabel>
                                <InfoValue>{auctionDateString}</InfoValue>
                            </InfoCol>
                        </Info>
                    </InfoContainer>
                </RightAucInfo>
            </Header>
            {collapse ? null : (
                <Content>
                    <SectionContent>
                        <Bidders>
                            <Heads>
                                <Head>Event Type</Head>
                                <Head>Buyer</Head>
                                <Head>Timestamp</Head>
                                <Head>Sell Amount</Head>
                                <Head>Buy Amount</Head>
                                <Head>TX</Head>
                            </Heads>

                            {biddersList.map((bidder, i: number) => {
                                return (
                                    <List key={bidder.bidder + i}>
                                        <BidLine
                                            eventType={returnEventType(i)}
                                            bidder={bidder.bidder}
                                            date={bidder.createdAt}
                                            bid={parseWadAmount(bidder.bid)}
                                            buyAmount={parseWadAmount(bidder.buyAmount)}
                                            buySymbol={buySymbol}
                                            sellSymbol={tokenSymbol}
                                            createdAtTransaction={bidder.createdAtTransaction}
                                        />
                                    </List>
                                )
                            })}
                        </Bidders>

                        {returnBtn()}
                    </SectionContent>
                </Content>
            )}
        </Container>
    )
}

export default CollateralAuctionBlock

const Container = styled.div`
    border-radius: 8px;
    margin-bottom: 15px;
    background: white;
    border: 3px solid #1a74ec;
    box-shadow: 6px 6px 0px 0px #1a74ec, 5px 5px 0px 0px #1a74ec, 4px 4px 0px 0px #1a74ec, 3px 3px 0px 0px #1a74ec,
        2px 2px 0px 0px #1a74ec, 1px 1px 0px 0px #1a74ec;
`
const Header = styled.div`
    font-size: ${(props) => props.theme.font.small};
    font-weight: 600;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items:flex-start;
  `}
`

const Info = styled.div`
    display: flex;
    align-items: center;
    ${({ theme }) => theme.mediaWidth.upToSmall`
      flex-direction:column;
    
  `}
`

const InfoCol = styled.div`
    font-size: ${(props) => props.theme.font.small};
    min-width: 100px;
    padding: 0px 10px 0px;

    ${({ theme }) => theme.mediaWidth.upToSmall`
      flex: 0 0 100%;
      min-width:100%;
      display:flex;
      align-items:center;
      justify-content:space-between;
      margin-left:0;
      margin-top:5px;
    
  `}
`

const InfoLabel = styled.div`
    color: ${(props) => props.theme.colors.secondary};
    font-size: ${(props) => props.theme.font.xSmall};
`
const InfoValue = styled.div`
    margin-top: 3px;
    color: ${(props) => props.theme.colors.primary};
    font-weight: normal;
    font-size: ${(props) => props.theme.font.xSmall};
`

const Content = styled.div`
    padding: 20px 0px 20px 0px;
    margin: 0 20px;
    border-top: 1px solid ${(props) => props.theme.colors.border};
`

const SectionContent = styled.div`
    font-size: ${(props) => props.theme.font.default};
`

const BtnContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding-top: 15px;
    margin-bottom: -5px;
    margin-top: 10px;
    border-top: 1px solid ${(props) => props.theme.colors.border};
    button {
        width: 200px;
    }
`

const LeftAucInfo = styled.div<{ type?: string }>`
    display: flex;
    align-items: center;
    img {
        margin-right: 10px;
        width: 25px;
    }
`

const RightAucInfo = styled.div`
    display: flex;
    align-items: center;
    ${({ theme }) => theme.mediaWidth.upToSmall`
      flex: 0 0 100%;
      min-width:100%;
      flex-direction:column;
  `}
`

const InfoContainer = styled.div`
    ${({ theme }) => theme.mediaWidth.upToSmall`
    order:2;
    min-width:100%;
  `}
`

const Bidders = styled.div`
    /* margin-top: 20px; */
`

const Heads = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    display:none;
  `}
`

const Head = styled.div`
    flex: 0 0 16.6%;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    color: ${(props) => props.theme.colors.secondary};
    padding-left: 10px;
    &:first-child {
        padding-left: 25px;
    }
`

const ListItemLabel = styled.div`
    display: none;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    display:block;
    margin-bottom:5px;
    font-weight:normal;
  `}
`

const List = styled.div`
    display: flex;
    align-items: center;
    border-radius: 10px;
    &:nth-child(even) {
        // background: #12385e;
    }
    &.winner {
        background: ${(props) => props.theme.colors.greenish};
        a,
        div {
            color: ${(props) => props.theme.colors.neutral} !important;
        }
        ${ListItemLabel} {
            color: ${(props) => props.theme.colors.background} !important;
        }
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap:wrap;
    margin-bottom:10px;
    &:last-child {
      margin-bottom:0;
    }

  `}
`
