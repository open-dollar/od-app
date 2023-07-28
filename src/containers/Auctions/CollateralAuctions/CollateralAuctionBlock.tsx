import dayjs from 'dayjs'
import { BigNumber } from 'ethers'
import { useState } from 'react'
import styled from 'styled-components'
import _ from '~/utils/lodash'

import BidLine from '~/components/BidLine'
import { useActiveWeb3React } from '~/hooks'
import { useStoreActions, useStoreState } from '~/store'
import { ICollateralAuction } from '~/types'
import { COIN_TICKER, formatNumber, parseWad } from '~/utils'
import AlertLabel from '~/components/AlertLabel'
import Button from '~/components/Button'
// import { utils as gebUtils } from 'geb.js'

type Props = ICollateralAuction & { isCollapsed: boolean }

const CollateralAuctionBlock = (auction: Props) => {
    const {
        auctionId,
        isClaimed,
        remainingToRaiseE18,
        remainingCollateral,
        tokenSymbol,
        biddersList,
        isCollapsed,
        maxDiscountTimestamp,
    } = auction

    const { account } = useActiveWeb3React()
    const { popupsModel: popupsActions, auctionModel: auctionActions } = useStoreActions((state) => state)

    const { connectWalletModel: connectWalletState, auctionModel: auctionsState } = useStoreState((state) => state)

    const [collapse, setCollapse] = useState(isCollapsed)

    const buySymbol = COIN_TICKER

    // const endsOn = auctionDeadline ? dayjs.unix(Number(auctionDeadline)).format('MMM D, h:mm A') : ''

    const isOngoingAuction = BigNumber.from(remainingCollateral).gt('0')

    const remainingCollateralParsed = formatNumber(parseWad(BigNumber.from(remainingCollateral)), 4)

    const buyAmountParsed = formatNumber(parseWad(BigNumber.from(remainingToRaiseE18)), 4)

    const eventType = 'COLLATERAL'

    const userProxy = _.get(connectWalletState, 'proxyAddress', '')

    const endsOn = dayjs.unix(Number(maxDiscountTimestamp)).format('MMM D, h:mm A')

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

    const returnLabel = () => {
        if (isOngoingAuction) {
            return {
                text: 'Auction is Ongoing',
                label: 'warning',
            }
        } else if (isClaimed) {
            return {
                text: 'Auction Completed',
                label: 'success',
            }
        } else {
            return {
                text: 'Auction to Settle',
                label: 'greenish',
            }
        }
    }

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
                                <InfoLabel>{tokenSymbol} OFFERED</InfoLabel>
                                <InfoValue>{`${remainingCollateralParsed} ${tokenSymbol}`}</InfoValue>
                            </InfoCol>

                            <InfoCol>
                                <InfoLabel>
                                    {buySymbol} {eventType === 'COLLATERAL' ? 'TO RAISE' : 'BID'}
                                </InfoLabel>
                                <InfoValue>{`${buyAmountParsed} ${buySymbol}`}</InfoValue>
                            </InfoCol>

                            <InfoCol>
                                <InfoLabel>DISCOUNT {isOngoingAuction ? 'ENDS ON' : 'ENDED ON'}</InfoLabel>
                                <InfoValue>{endsOn}</InfoValue>
                            </InfoCol>
                        </Info>
                    </InfoContainer>

                    <AlertContainer>
                        <AlertLabel text={returnLabel().text + ' '} type={returnLabel().label} />
                    </AlertContainer>
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
    width: 200px;
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
