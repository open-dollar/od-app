import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import styled from 'styled-components'
import { ExternalLinkArrow } from '../GlobalStyle'
import { useStoreActions, useStoreState } from '../store'
import { COIN_TICKER } from '../utils/constants'
import AlertLabel from './AlertLabel'
import Button from './Button'
import _ from '../utils/lodash'
import { ChainId, IAuction, IAuctionBidder } from '../utils/interfaces'
import {
    formatNumber,
    getEtherscanLink,
    returnWalletAddress,
} from '../utils/helper'
import { useActiveWeb3React } from '../hooks'
import { utils as gebUtils } from 'geb.js'
import { BigNumber } from 'ethers'
import { parseWad } from '../utils/gebManager'

type Props = IAuction & { isCollapsed: boolean }

const AuctionBlock = (auction: Props) => {
    const { chainId, account } = useActiveWeb3React()
    const { t } = useTranslation()
    const { popupsModel: popupsActions, auctionsModel: auctionsActions } =
        useStoreActions((state) => state)

    const {
        connectWalletModel: connectWalletState,
        auctionsModel: auctionsState,
    } = useStoreState((state) => state)

    const isCollapsed = _.get(auction, 'isCollapsed', false)

    const [collapse, setCollapse] = useState(isCollapsed)

    const id = _.get(auction, 'auctionId', '')
    const eventType = _.get(auction, 'englishAuctionType', 'debt')
    const buyToken = _.get(auction, 'buyToken', 'COIN')
    const sellToken = _.get(auction, 'sellToken', 'PROTOCOL_TOKEN')
    const buyAmount = _.get(auction, 'buyAmount', '0')
    const buyInitialAmount = _.get(auction, 'buyInitialAmount', '0')

    const sellInititalAmount = _.get(auction, 'sellInitialAmount', '0')
    const buySymbol =
        buyToken === 'PROTOCOL_TOKEN_LP'
            ? 'FLX/ETH LP'
            : buyToken === 'COIN'
            ? COIN_TICKER
            : 'FLX'
    const sellAmount = _.get(auction, 'sellAmount', '0')

    const sellSymbol =
        sellToken === 'PROTOCOL_TOKEN_LP'
            ? 'FLX/ETH LP'
            : sellToken === 'COIN'
            ? COIN_TICKER
            : 'FLX'
    const auctionDeadline = _.get(auction, 'auctionDeadline', '')
    const isClaimed = _.get(auction, 'isClaimed', false)
    const endsOn = auctionDeadline
        ? dayjs.unix(Number(auctionDeadline)).format('MMM D, h:mm A')
        : ''
    const isOngoingAuction = auctionDeadline
        ? Number(auctionDeadline) * 1000 > Date.now()
        : false
    const bidders = _.get(auction, 'englishAuctionBids', [])
    const biddersList = _.get(auction, 'biddersList', [])
    const winner = _.get(auction, 'winner', '')

    const parseRadToWad = (amount: string) => {
        const amountBN = BigNumber.from(amount)
        return formatNumber(parseWad(gebUtils.decimalShift(amountBN, -9)), 2)
    }
    // kickstart bid as in first bid when auction started
    const kickBidder = {
        bidder: _.get(auction, 'startedBy', ''),
        buyAmount: _.get(auction, 'buyInitialAmount', ''),
        createdAt: _.get(auction, 'createdAt', ''),
        sellAmount: _.get(auction, 'sellInitialAmount', ''),
        createdAtTransaction: _.get(auction, 'createdAtTransaction', ''),
    }

    const userProxy = _.get(connectWalletState, 'proxyAddress', '')

    const returnWad = (amount: string, i: number) => {
        if (!amount) return '0'
        if (eventType === 'STAKED_TOKEN' && i !== biddersList.length - 1) {
            return parseRadToWad(amount)
        }
        return formatNumber(amount, 2)
    }
    const returnEventType = (bidder: IAuctionBidder, i: number) => {
        if (
            !isOngoingAuction &&
            bidder.sellAmount === sellAmount &&
            isClaimed &&
            i === 0
        ) {
            return 'Settle'
        }
        if (bidder.bidder === kickBidder.bidder) {
            return 'Start'
        }
        return 'Bid'
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
        auctionsActions.setSelectedAuction(auction)
    }

    const returnBtn = () => {
        if (
            !isOngoingAuction &&
            !isClaimed &&
            userProxy &&
            winner &&
            userProxy === winner.toLowerCase() &&
            bidders.length
        ) {
            return (
                <BtnContainer>
                    <Button
                        text={t('Settle')}
                        withArrow
                        disabled={auctionsState.isSubmitting}
                        onClick={() => handleClick('settle')}
                    />
                </BtnContainer>
            )
        }

        if (
            isOngoingAuction ||
            !bidders.length ||
            (userProxy &&
                winner &&
                userProxy.toLowerCase() === winner.toLowerCase() &&
                !isClaimed)
        ) {
            return (
                <BtnContainer>
                    <Button
                        text={'Bid'}
                        withArrow
                        disabled={
                            auctionsState.isSubmitting ||
                            (isOngoingAuction &&
                                userProxy &&
                                winner &&
                                userProxy.toLowerCase() ===
                                    winner.toLowerCase())
                        }
                        onClick={() => handleClick('rai_bid')}
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
        } else if (isClaimed && winner) {
            return {
                text: 'Auction Completed',
                label: 'success',
            }
        } else if (!isClaimed && !winner) {
            return {
                text: 'Auction to Restart',
                label: 'dimmed',
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
                    <img
                        src={
                            require(`../assets/${
                                eventType === 'STAKED_TOKEN'
                                    ? 'flx_uni_eth'
                                    : eventType.toLowerCase()
                            }.svg`).default
                        }
                        alt="debt type auction"
                    />

                    {`Auction #${id}`}
                </LeftAucInfo>

                <RightAucInfo>
                    <InfoContainer>
                        <Info>
                            <InfoCol
                                className={
                                    eventType === 'STAKED_TOKEN'
                                        ? 'staked_token'
                                        : ''
                                }
                            >
                                <InfoLabel>{sellSymbol} OFFERED</InfoLabel>
                                <InfoValue>{`${formatNumber(
                                    eventType === 'DEBT' &&
                                        Number(sellAmount) !==
                                            Number(sellInititalAmount)
                                        ? sellAmount
                                        : sellInititalAmount,
                                    2
                                )} ${sellSymbol}`}</InfoValue>
                            </InfoCol>

                            <InfoCol>
                                <InfoLabel>{buySymbol} BID</InfoLabel>
                                <InfoValue>{`${formatNumber(
                                    eventType === 'STAKED_TOKEN' &&
                                        Number(buyAmount) !==
                                            Number(buyInitialAmount)
                                        ? parseRadToWad(buyAmount)
                                        : buyAmount,
                                    2
                                )} ${buySymbol}`}</InfoValue>
                            </InfoCol>

                            <InfoCol>
                                <InfoLabel>
                                    {isOngoingAuction ? 'ENDS ON' : 'ENDED ON'}
                                </InfoLabel>
                                <InfoValue>{endsOn}</InfoValue>
                            </InfoCol>
                        </Info>
                    </InfoContainer>

                    <AlertContainer>
                        <AlertLabel
                            text={returnLabel().text + ' '}
                            type={returnLabel().label}
                        />
                    </AlertContainer>
                </RightAucInfo>
            </Header>
            {collapse ? null : (
                <Content>
                    <SectionContent>
                        <Bidders>
                            <Heads>
                                <Head>Event Type</Head>
                                <Head>Bidder</Head>
                                <Head>Timestamp</Head>
                                <Head>Sell Amount</Head>
                                <Head>Buy Amount</Head>
                                <Head>TX</Head>
                            </Heads>

                            {biddersList.map(
                                (bidder: IAuctionBidder, i: number) => {
                                    return (
                                        <List
                                            key={bidder.bidder + i}
                                            className={
                                                winner &&
                                                !isOngoingAuction &&
                                                bidder.sellAmount ===
                                                    sellAmount &&
                                                bidder.bidder.toLowerCase() ===
                                                    winner.toLowerCase() &&
                                                i === 0
                                                    ? 'winner'
                                                    : ''
                                            }
                                        >
                                            <ListItem>
                                                <ListItemLabel>
                                                    Event Type
                                                </ListItemLabel>
                                                {returnEventType(bidder, i)}
                                            </ListItem>
                                            <ListItem>
                                                <ListItemLabel>
                                                    Bidder
                                                </ListItemLabel>
                                                <Link
                                                    href={getEtherscanLink(
                                                        chainId as ChainId,
                                                        bidder.bidder,
                                                        'address'
                                                    )}
                                                    target="_blank"
                                                >
                                                    {returnWalletAddress(
                                                        bidder.bidder
                                                    )}
                                                </Link>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemLabel>
                                                    Timestamp
                                                </ListItemLabel>
                                                {dayjs
                                                    .unix(
                                                        Number(bidder.createdAt)
                                                    )
                                                    .format('MMM D, h:mm A')}
                                            </ListItem>
                                            <ListItem>
                                                <ListItemLabel>
                                                    Sell Amount
                                                </ListItemLabel>
                                                {formatNumber(
                                                    bidder.sellAmount,
                                                    2
                                                )}{' '}
                                                {sellSymbol}
                                            </ListItem>
                                            <ListItem>
                                                <ListItemLabel>
                                                    Buy Amount
                                                </ListItemLabel>
                                                {returnWad(bidder.buyAmount, i)}{' '}
                                                {buySymbol}
                                            </ListItem>
                                            <ListItem>
                                                <ListItemLabel>
                                                    TX
                                                </ListItemLabel>
                                                <Link
                                                    href={getEtherscanLink(
                                                        chainId as ChainId,
                                                        bidder.createdAtTransaction,
                                                        'transaction'
                                                    )}
                                                    target="_blank"
                                                >
                                                    {returnWalletAddress(
                                                        bidder.createdAtTransaction
                                                    )}
                                                </Link>
                                            </ListItem>
                                        </List>
                                    )
                                }
                            )}
                        </Bidders>

                        {returnBtn()}
                    </SectionContent>
                </Content>
            )}
        </Container>
    )
}

export default AuctionBlock

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
    @media (min-width: 991px) {
        &.staked_token {
            min-width: 170px;
        }
    }

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

const Link = styled.a`
    ${ExternalLinkArrow}
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

const ListItem = styled.div`
    flex: 0 0 16.6%;
    color: ${(props) => props.theme.colors.customSecondary};
    font-size: ${(props) => props.theme.font.extraSmall};
    padding: 15px 10px;
    &:first-child {
        padding-left: 25px;
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
      &:first-child {
        padding: 15px 20px;
    }
    padding: 15px 20px;

    flex: 0 0 50%;
    min-width:50%;
    font-size: ${(props) => props.theme.font.extraSmall};
    font-weight:900;
  `}
`
