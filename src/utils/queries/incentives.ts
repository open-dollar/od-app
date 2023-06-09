import { userQuery } from './user'

const past24HBlocks = (blockNumber: number) => blockNumber - (24 * 3600) / 15

export const incentiveCampaignsQuery = (
    address: string,
    blockNumber: number
) => `{
    ${userQuery(address)}
    userProxies(where: {owner: "${address}"}) {
      address
      coinAllowance {
        amount
      }
      uniCoinLpAllowance{
        amount
      }
    }
    incentiveCampaigns(orderBy: campaignNumber, orderDirection: desc) {
        campaignAddress
        campaignNumber
        rewardsDuration
        lastUpdatedTime
        periodFinish
        rewardRate
        totalSupply
        rewardToken
        rewardPerTokenStored
      }
    systemState(id: "current") {
        coinAddress
        wethAddress
        coinUniswapPair {
          totalSupply
          reserve0
          reserve1
          token0      
          token0Price
          token1Price
         }
         currentCoinMedianizerUpdate{
          value
        }
      }
    incentiveBalances(where: {owner: "${address}"}) {
        id
        stakeBalance
        address
        owner {
          id
        }
        reward
        userRewardPerTokenPaid
      }

      raiBalance:erc20Balances(where: {address: "${address}", label: "COIN"}) {
        balance
        }
      protBalance:erc20Balances(where: {address: "${address}", label: "PROT_TOKEN"}) {
        balance
        }
      uniswapCoinPool:erc20Balances(where: {address: "${address}", label: "UNISWAP_POOL_TOKEN_COIN"}) {
        balance
        }
      stakedBalance:erc20Balances(where: {owner: "${address}", label: "INCENTIVE_STAKE"}) {
        balance
        }
      old24hData:systemState(id: "current", block: {number: ${past24HBlocks(
          blockNumber
      )}}) {
        coinAddress
        wethAddress
        coinUniswapPair {
          totalSupply
          reserve0
          reserve1
         }
        currentCoinMedianizerUpdate{
          value
        }
        }
}`
