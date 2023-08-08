import { JsonRpcSigner } from '@ethersproject/providers'
import { ICollateralAuction as SDKCollateralAuction } from '@usekeyp/od-sdk/lib/schema/auction'

export type AuctionEventType = 'DEBT' | 'SURPLUS' | 'COLLATERAL'

export interface IAuctionBidder {
    bidder: string
    buyAmount: string
    createdAt: string
    sellAmount: string
    createdAtTransaction: string
}

export interface IAuction {
    auctionDeadline: string
    auctionId: string
    buyAmount: string
    buyInitialAmount: string
    buyToken: string
    startedBy: string
    createdAt: string
    createdAtTransaction: string
    englishAuctionBids: Array<IAuctionBidder>
    englishAuctionConfiguration: {
        bidDuration: string
        bidIncrease: string
        totalAuctionLength: string
        DEBT_amountSoldIncrease: string
    }
    biddersList: Array<IAuctionBidder>
    englishAuctionType: AuctionEventType
    isClaimed: boolean
    sellAmount: string
    sellInitialAmount: string
    sellToken: string
    winner: string
    tokenSymbol?: string
}

export interface IAuctionBid {
    bid?: string
    auctionId: string
    title: string
    signer: JsonRpcSigner
    auctionType: AuctionEventType
    type?: AuctionEventType
}

export interface ICollateralAuction extends SDKCollateralAuction {
    startedBy: string
    remainingToRaiseE18: string
    remainingCollateral: string
    tokenSymbol: string
    maxDiscountTimestamp: string
}
