import dayjs from 'dayjs'
import { BigNumber, constants, ethers } from 'ethers'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import _ from '~/utils/lodash'

import BidLine from '~/components/BidLine'
import { useActiveWeb3React } from '~/hooks'
import { useStoreActions, useStoreState } from '~/store'
import { ICollateralAuction } from '~/types'
import { COIN_TICKER, formatDataNumber, formatNumber, parseWad } from '~/utils'
import AlertLabel from '~/components/AlertLabel'
import Button from '~/components/Button'

type Props = ICollateralAuction & { isCollapsed: boolean }

const CollateralAuctionBlock = (auction: Props) => {
    const { auctionId, isClaimed, remainingToRaiseE18, remainingCollateral, tokenSymbol, biddersList, isCollapsed } =
        auction

    const { account } = useActiveWeb3React()
    const { popupsModel: popupsActions, auctionModel: auctionActions } = useStoreActions((state) => state)

    const { connectWalletModel: connectWalletState, auctionModel: auctionsState } = useStoreState((state) => state)

    const [collapse, setCollapse] = useState(isCollapsed)

    const buySymbol = COIN_TICKER

    const isOngoingAuction = BigNumber.from(remainingCollateral).gt('0') && BigNumber.from(remainingToRaiseE18).gt('0')

    const remainingCollateralParsed = formatNumber(parseWad(BigNumber.from(remainingCollateral)), 4)

    const buyAmountParsed = formatNumber(parseWad(BigNumber.from(remainingToRaiseE18)), 4)

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
                        text={'Buy'}
                        withArrow
                        disabled={auctionsState.isSubmitting || !(isOngoingAuction && userProxy)}
                        onClick={() => handleClick('buy')}
                    />
                </BtnContainer>
            )
        }
        return null
    }

    // const returnLabel = () => {
    //     if (isOngoingAuction) {
    //         return {
    //             text: 'Auction is Ongoing',
    //             label: 'warning',
    //         }
    //     } else if (isClaimed) {
    //         return {
    //             text: 'Auction Completed',
    //             label: 'success',
    //         }
    //     } else {
    //         return {
    //             text: 'Auction to Settle',
    //             label: 'greenish',
    //         }
    //     }
    // }

    const marketPriceOD = '10'
    const marketPriceFTRG = '10'
    const amountOD = '10'
    const amountFTRG = '10'
    const auctionEndTime = '2023-09-23T09:16:00Z'

    // const localizedAuctionEndTime = dayjs(auctionEndTime).format('lll')

    const localizedAuctionEndTime = '10'
    const { connectWalletModel } = useStoreState((state) => state)

    const odBalance = useMemo(() => {
        const balances = connectWalletModel.tokensFetchedData
        return balances.OD.balanceE18.toString() || '0'
        // return formatDataNumber(balances.OD ? balances.OD.balanceE18.toString() : '0', 18, 2, false)
    }, [connectWalletModel.tokensFetchedData])

    const collateralBalance = useMemo(() => {
        console.log(tokenSymbol, 'tokenSymbol')
        const balances = connectWalletModel.tokensFetchedData
        console.log(balances, 'balances')
        return balances.FTRG.balanceE18.toString() || '0'
    }, [connectWalletModel.tokensFetchedData])

    // const remainingToRaise = _.get(auction, 'remainingToRaiseE18', '0')
    //
    // const maxAmount = (function () {
    //         const odToBidPlusOne = BigNumber.from(remainingToRaise).add(1)
    //         const odToBid = ethers.utils.formatUnits(odToBidPlusOne.toString(), 18)
    //         const odBalanceNumber = Number(odBalance)
    //         return odBalanceNumber < Number(odToBid) ? odBalance : odToBid.toString()
    // })()
    //
    // const collateralPrice = useMemo(() => {
    //     console.log(auction, 'auction')
    //     console.log(auctionsState.collateralData, 'auctionsState.collateralData')
    //     if (auctionsState.collateralData) {
    //         const data = auctionsState.collateralData.filter((item) => item._auctionId.toString() === auctionId)
    //         const price = data[0]?._boughtCollateral.mul(constants.WeiPerEther).div(data[0]._adjustedBid)
    //
    //         // we divide by 1e18 because we multiplied by 1e18 in the line above
    //         // this was required to handle decimal prices (<0)
    //         return price
    //     }
    //     return BigNumber.from('0')
    // }, [auctionId, auctionsState.collateralData])
    //
    // console.log(collateralPrice, 'collateralPrice')
    //
    // const maxCollateral = BigNumber.from(ethers.utils.parseEther(maxAmount))
    //     .mul(collateralPrice)
    //     .div(constants.WeiPerEther)
    // console.log(maxCollateral, 'maxCollateral')
    // const maxCollateralParsed = ethers.utils.formatEther(maxCollateral)
    //

    const marketPriceODParsed = formatNumber(parseWad(BigNumber.from(marketPriceOD)), 4)

    console.log(odBalance, 'odBalance')
    console.log(marketPriceOD, 'marketPriceOD')
    console.log(collateralBalance, 'collateralBalance')

    const auctionPrice = BigNumber.from(odBalance)
        .mul(BigNumber.from(marketPriceOD))
        .div(collateralBalance ? BigNumber.from(collateralBalance) : 1)

    const auctionDiscount = BigNumber.from('10000').sub(auctionPrice.mul(10000).div(marketPriceFTRG))

    return (
        <Container>
            <Header onClick={() => setCollapse(!collapse)}>
                <LeftAucInfo type={eventType.toLowerCase()}>
                    <img src={require(`../../../assets/${eventType.toLowerCase()}.svg`)} alt="auction" />
                    {`Auction #${auctionId}`}
                </LeftAucInfo>

                <RightAucInfo>
                    <InfoContainer>
                        <Info>
                            <InfoCol>
                                <InfoLabel>{tokenSymbol} AVAILABLE</InfoLabel>
                                <InfoValue>{`${remainingCollateralParsed} ${tokenSymbol}`}</InfoValue>
                                {/*<InfoValue>{`${formatNumber(maxCollateralParsed, 4)} ${tokenSymbol}`}</InfoValue>*/}
                            </InfoCol>
                            <InfoCol>
                                <InfoLabel>MARKET PRICE</InfoLabel>
                                <InfoValue>{`$1.001 ${tokenSymbol}`}</InfoValue>
                            </InfoCol>
                            <InfoCol>
                                <InfoLabel>AUCTION PRICE</InfoLabel>
                                <InfoValue>{`${formatDataNumber(
                                    auctionPrice ? auctionPrice.toString() : '0',
                                    18,
                                    2,
                                    false
                                )} ${buySymbol}`}</InfoValue>
                            </InfoCol>
                            <InfoCol>
                                <InfoLabel>AUCTION DISCOUNT</InfoLabel>
                                <InfoValue>{`${formatDataNumber(
                                    auctionDiscount ? auctionDiscount.toString() : '0',
                                    18,
                                    2,
                                    false
                                )}% below market price`}</InfoValue>
                            </InfoCol>

                            {/*<InfoCol>*/}
                            {/*    <InfoLabel>*/}
                            {/*        {buySymbol} {eventType === 'COLLATERAL' ? 'TO RAISE' : 'BID'}*/}
                            {/*    </InfoLabel>*/}
                            {/*    <InfoValue>{`${buyAmountParsed} ${buySymbol}`}</InfoValue>*/}
                            {/*</InfoCol>*/}
                            <InfoCol>
                                <InfoLabel>AUCTION ENDS</InfoLabel>
                                <InfoValue>{localizedAuctionEndTime}</InfoValue>
                            </InfoCol>
                        </Info>
                    </InfoContainer>

                    {/*<AlertContainer>*/}
                    {/*    <AlertLabel text={returnLabel().text + ' '} type={returnLabel().label} />*/}
                    {/*</AlertContainer>*/}
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
    border-radius: 15px;
    margin-bottom: 15px;
    background: #05284c;
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
    font-size: ${(props) => props.theme.font.extraSmall};
`
const InfoValue = styled.div`
    margin-top: 3px;
    color: ${(props) => props.theme.colors.primary};
    font-weight: normal;
    font-size: ${(props) => props.theme.font.extraSmall};
`

const Content = styled.div`
    padding: 20px 20px 20px 20px;
    border-top: 1px solid ${(props) => props.theme.colors.border};
    background: #031f3a;
    border-radius: 0 0 15px 15px;
`

const SectionContent = styled.div`
    font-size: ${(props) => props.theme.font.default};
`

const BtnContainer = styled.div`
    text-align: right;
    padding-top: 15px;
    margin-bottom: -5px;
    margin-top: 10px;
    border-top: 1px solid ${(props) => props.theme.colors.border};
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

const AlertContainer = styled.div`
    width: 150px;
    text-align: right;
    > div {
        display: inline-block;
        margin-left: auto;
        padding-right: 10px !important;
    }
    div {
        font-size: 13px;
        ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-left:0;
 
  `}
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
   
      margin-top:10px;
      margin-bottom:10px;
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
   color: ${(props) => props.theme.colors.customSecondary};
  `}
`

const List = styled.div`
    display: flex;
    align-items: center;
    border-radius: 10px;
    &:nth-child(even) {
        background: #12385e;
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
    border:1px solid ${(props) => props.theme.colors.border};
    margin-bottom:10px;
    &:last-child {
      margin-bottom:0;
    }

  `}
`
