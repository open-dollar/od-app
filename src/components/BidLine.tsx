import dayjs from 'dayjs'
import styled from 'styled-components'

import { ExternalLinkArrow } from '~/GlobalStyle'
import { useActiveWeb3React } from '~/hooks'
import { ChainId, formatNumber, getEtherscanLink } from '~/utils'
import { useAddress } from '~/hooks/useAddress'

type Props = {
    eventType: string
    bidder: string
    date: string
    bid: string
    buyAmount: string
    buySymbol: string
    sellSymbol: string
    createdAtTransaction: string
}

const BidLine = ({ eventType, bidder, date, bid, buyAmount, buySymbol, sellSymbol, createdAtTransaction }: Props) => {
    const { chainId } = useActiveWeb3React()
    const address = useAddress(bidder)

    const returnWad = (amount: string) => {
        if (!amount) return '0'
        return formatNumber(amount, 2)
    }

    return (
        <>
            <ListItem>{eventType}</ListItem>
            <ListItem>
                {bidder && (
                    <Link href={getEtherscanLink(chainId as ChainId, bidder, 'address')} target="_blank">
                        {address}
                    </Link>
                )}
            </ListItem>
            <ListItem>
                <ListItemLabel>Timestamp</ListItemLabel>
                {dayjs.unix(Number(date)).format('MMM D, h:mm A')}
            </ListItem>
            <ListItem>
                <ListItemLabel>Sell Amount</ListItemLabel>
                {formatNumber(bid)} {sellSymbol}
            </ListItem>
            <ListItem>
                <ListItemLabel>Buy Amount</ListItemLabel>
                {returnWad(buyAmount)} {buySymbol}
            </ListItem>
            <ListItem>
                <ListItemLabel>TX</ListItemLabel>
                <Link href={getEtherscanLink(chainId as ChainId, createdAtTransaction, 'transaction')} target="_blank">
                    {useAddress(createdAtTransaction)}
                </Link>
            </ListItem>
        </>
    )
}

export default BidLine

const Link = styled.a`
    ${ExternalLinkArrow}
`

const ListItemLabel = styled.div`
    display: none;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    display:block;
    margin-bottom:5px;
    font-weight:normal;
  `}
`

const ListItem = styled.div`
    flex: 0 0 16.6%;
    font-size: ${(props) => props.theme.font.xSmall};
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
    font-size: 16px;
    font-weight:900;
  `}
`
