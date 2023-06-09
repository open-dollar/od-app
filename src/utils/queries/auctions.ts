import { userQuery } from './user'

export const auctionsQuery = (address: string, type = 'DEBT') => `{
  englishAuctions (orderBy:auctionId, orderDirection: desc, where:{englishAuctionType: ${type}}){
    auctionId
    englishAuctionType
    sellToken
    buyToken
    sellInitialAmount
    buyInitialAmount
    sellAmount
    buyAmount
    startedBy
    createdAt
    auctionDeadline
    createdAtTransaction
    winner
    isClaimed
    englishAuctionConfiguration {
      bidIncrease
      bidDuration
      totalAuctionLength
      DEBT_amountSoldIncrease
    }
    englishAuctionBids {
      bidder
      buyAmount
      sellAmount
      createdAt
      createdAtTransaction
    }
  }
  userProxies(where: {owner: "${address}"}) {
    address
    coinAllowance{
      amount
    }
    protAllowance{
      amount
    }
  }
  raiBalance:erc20Balances(where: {address: "${address}", label: "COIN"}) {
    balance
  }
  protBalance:erc20Balances(where: {address: "${address}", label: "PROT_TOKEN"}) {
    balance
  }
  ${userQuery(address)}
  }`
