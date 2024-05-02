import { BigNumber, ethers } from 'ethers'

import { CamelotNitroPool, ERC20 } from '../typechained'
import { Geb } from '@opendollar/sdk'


export type NitroPoolDetails = {
    tvl: number,
    pendingRewards: {
        pending1: number,
        pending2: number,
    },
    settings: {
        startTime: BigNumber
        endTime: BigNumber
        harvestStartTime: BigNumber
        depositEndTime: BigNumber
        lockDurationReq: BigNumber
        lockEndReq: BigNumber
        depositAmountReq: BigNumber
        whitelist: boolean
        description: string
    }
    rewardsPerSecond: number
    lpTokenBalance: number
    userInfo: {
        totalDepositAmount: BigNumber
        rewardDebtToken1: BigNumber
        rewardDebtToken2: BigNumber
        pendingRewardsToken1: BigNumber
        pendingRewardsToken2: BigNumber
    } | null
    apy: number
}

type AvailableDepositTypes = 'WSTETH' | 'RETH'

const fetchNitroPool = async (geb: Geb, collateralType: AvailableDepositTypes, address: string | null): Promise<NitroPoolDetails> => {
    const ODGAddress = geb.tokenList['ODG'].address
    const collateralAddress = geb.tokenList[collateralType].address
    const collateralChainlinkRelayer = geb.tokenList[collateralType].chainlinkRelayer
    const odgChainlinkRelayerAddress = geb.tokenList['ODG'].chainlinkRelayer;

    if (!ODGAddress || !collateralAddress || !collateralChainlinkRelayer) {
        console.warn('Missing token info in tokenlist')
        return {
            tvl: 0,
            pendingRewards: {
                pending1: 0,
                pending2: 0,
            },
            settings: {
                startTime: BigNumber.from(0),
                endTime: BigNumber.from(0),
                harvestStartTime: BigNumber.from(0),
                depositEndTime: BigNumber.from(0),
                lockDurationReq: BigNumber.from(0),
                lockEndReq: BigNumber.from(0),
                depositAmountReq: BigNumber.from(0),
                whitelist: false,
                description: '',
            },
            rewardsPerSecond: 0,
            lpTokenBalance: 0,
            userInfo: null,
            apy: 0,
        }
    }

    const odg = geb.getErc20Contract(ODGAddress)
    const collateral = geb.getErc20Contract(collateralAddress)

    const camelotNitroPool = await geb.contracts[`camelot${collateralType}NitroPool`]

    const chainlinkRelayerContract = new ethers.Contract(
        collateralChainlinkRelayer,
        ['function getResultWithValidity() external view returns (uint256 _result, bool _validity)'],
        geb.provider
    )

    const chainlinkRelayerContractODG = new ethers.Contract(
        odgChainlinkRelayerAddress,
        ['function getResultWithValidity() external view returns (uint256 _result, bool _validity)'],
        geb.provider
    );

    const [odgPrice, odgPriceValidity] = await chainlinkRelayerContractODG.getResultWithValidity();

    const [collateralPrice, collateralPriceValidity] = await chainlinkRelayerContract.getResultWithValidity()

    const odgMarketPriceFloat = parseFloat(ethers.utils.formatEther(odgPrice));

    // TODO: Collateral price is invalid for some reason so just doing ODG validity price check for now
    if (!odgPriceValidity) {
        console.warn('Chainlink price fetch invalid')
        return {
            tvl: 0,
            pendingRewards: {
                pending1: 0,
                pending2: 0,
            },
            settings: {
                startTime: BigNumber.from(0),
                endTime: BigNumber.from(0),
                harvestStartTime: BigNumber.from(0),
                depositEndTime: BigNumber.from(0),
                lockDurationReq: BigNumber.from(0),
                lockEndReq: BigNumber.from(0),
                depositAmountReq: BigNumber.from(0),
                whitelist: false,
                description: '',
            },
            rewardsPerSecond: 0,
            lpTokenBalance: 0,
            userInfo: null,
            apy: 0,
        }
    }

    const collateralPriceFloat = parseFloat(ethers.utils.formatEther(collateralPrice))

    const results = await Promise.all([
        multicall<
            [
                CamelotMulticallRequest<CamelotNitroPool, 'pendingRewards'>,
                CamelotMulticallRequest<CamelotNitroPool, 'settings'>,
                CamelotMulticallRequest<ERC20, 'balanceOf'>,
                CamelotMulticallRequest<ERC20, 'balanceOf'>
            ]
        >(geb, [
            {
                contract: camelotNitroPool,
                function: 'pendingRewards',
                args: [address],
            },
            {
                contract: camelotNitroPool,
                function: 'settings',
                args: [],
            },
            {
                contract: odg,
                function: 'balanceOf',
                args: [camelotNitroPool.address],
            },
            {
                contract: collateral,
                function: 'balanceOf',
                args: [camelotNitroPool.address],
            },
        ]),
        camelotNitroPool.rewardsToken1PerSecond(),
        address ? camelotNitroPool.userInfo(address) : Promise.resolve(null),
    ])

    const [
        {
            returnData: [pendingRewards, settings, [poolODGBalanceBN], [poolCollateralBalanceBN]],
        },
        nitroRewardsPerSecond,
        userInfo,
    ] = results as [
        { returnData: [any, any, BigNumber[], BigNumber[]] },
        BigNumber,
            {
                totalDepositAmount: BigNumber
                rewardDebtToken1: BigNumber
                rewardDebtToken2: BigNumber
                pendingRewardsToken1: BigNumber
                pendingRewardsToken2: BigNumber
            } | null
    ]

    const poolODGBalance = fromBigNumber(poolODGBalanceBN)
    const poolCollateralBalance = fromBigNumber(poolCollateralBalanceBN)
    const tvl = poolODGBalance * odgMarketPriceFloat + poolCollateralBalance * collateralPriceFloat
    const rewardsPerSecond = fromBigNumber(nitroRewardsPerSecond)
    const lpTokenBalance = userInfo ? fromBigNumber(userInfo.totalDepositAmount) : 0
    const apy = (rewardsPerSecond * SECONDS_IN_YEAR * odgMarketPriceFloat) / tvl
    return {
        tvl,
        pendingRewards: {
            pending1: fromBigNumber(pendingRewards[0]),
            pending2: fromBigNumber(pendingRewards[1]),
        },
        settings,
        rewardsPerSecond,
        lpTokenBalance,
        userInfo,
        apy,
    }
}

export { fetchNitroPool, AvailableDepositTypes }