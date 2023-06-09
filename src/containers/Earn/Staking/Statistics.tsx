import React, { useMemo } from 'react'
import styled from 'styled-components'
import numeral from 'numeral'
import Button from '../../../components/Button'
import { useActiveWeb3React } from '../../../hooks'
import { useClaimReward, useStakingInfo } from '../../../hooks/useStaking'
import { formatNumber } from '../../../utils/helper'

const returnImg = (type = 'flx', width = '20px', height = '20px') => {
    return (
        <img
            src={
                require(`../../../assets/${
                    type === 'flx' ? 'flx-logo.svg' : 'stFLX.svg'
                }`).default
            }
            width={width}
            height={height}
            alt=""
        />
    )
}

type StatsType = 'data' | 'info'
type Stats = {
    [K in StatsType]: Array<{
        label: string
        value: string | number
        img?: string
    }>
}
const Statistics = () => {
    const { account } = useActiveWeb3React()
    const { balances, poolAmounts, escrowData } = useStakingInfo()
    const { claimRewardCallback } = useClaimReward()
    const { poolBalance, weeklyReward } = poolAmounts
    const { percentVested } = escrowData
    const { stFlxBalance, myCurrentReward } = balances
    const mystFLXBalance = stFlxBalance
        ? Number(stFlxBalance) > 0
            ? (formatNumber(stFlxBalance) as string)
            : '0'
        : '0'

    const myWeeklyReward = useMemo(() => {
        return (Number(stFlxBalance) / Number(poolBalance)) * weeklyReward
    }, [poolBalance, weeklyReward, stFlxBalance])

    const escrowed = useMemo(() => {
        if (!percentVested || percentVested === 0) return myCurrentReward
        const percent = percentVested / 100
        return (Number(myCurrentReward) * percent).toString()
    }, [percentVested, myCurrentReward])

    const claimable = useMemo(() => {
        return (Number(myCurrentReward) - Number(escrowed)).toString()
    }, [escrowed, myCurrentReward])

    const handleClaimReward = async () => {
        try {
            await claimRewardCallback()
        } catch (error) {
            console.log(error)
        }
    }

    const stats: Stats = {
        data: [
            {
                label: 'Total Pool Balance',
                value: `${numeral(formatNumber(poolAmounts.poolBalance)).format(
                    '0.0'
                )} FLX/ETH LP`,
            },
            {
                label: 'APR',
                value: `${
                    Number(poolAmounts.apr) > 0
                        ? numeral(
                              formatNumber(poolAmounts.apr.toString(), 2)
                          ).format('0.0')
                        : '0'
                }%`,
            },
            {
                label: 'Weekly Rewards',
                value: formatNumber(poolAmounts.weeklyReward.toString(), 2),
                img: 'flx',
            },
        ],

        info: [
            {
                label: 'My stFLX',
                value: mystFLXBalance,
                img: 'stFLX',
            },
            {
                label: 'My Weekly Reward',
                value:
                    Number(myCurrentReward) === 0 || !account
                        ? '0'
                        : formatNumber(myWeeklyReward.toString()),
                img: 'flx',
            },
        ],
    }

    return (
        <Container>
            <Content>
                <StatsContainer>
                    {Object.keys(stats).map((key) => {
                        const isPrimary = key === 'data'
                        return (
                            <div key={key} className="blockie">
                                {stats[key as StatsType].map((item) => {
                                    return (
                                        <Flex key={item.label}>
                                            <Label
                                                color={
                                                    isPrimary
                                                        ? 'primary'
                                                        : 'secondary'
                                                }
                                            >
                                                {item.label}
                                            </Label>
                                            <Value>
                                                {item.img
                                                    ? returnImg(item.img)
                                                    : null}{' '}
                                                {item.value}
                                            </Value>
                                        </Flex>
                                    )
                                })}
                            </div>
                        )
                    })}
                </StatsContainer>
                <StatsFooter>
                    <RewardBox>
                        <RewardLabel>My Current Reward</RewardLabel>
                        <RewardValue>
                            {Number(claimable) > 0
                                ? Number(claimable) >= 0.0001
                                    ? formatNumber(claimable)
                                    : '< 0.0001'
                                : '0'}{' '}
                            {returnImg('flx')}
                            <span>+</span>
                            {Number(escrowed) > 0
                                ? Number(escrowed) >= 0.0001
                                    ? formatNumber(escrowed)
                                    : '< 0.0001'
                                : '0'}{' '}
                            {returnImg('flx')}
                            <span></span> Escrowed
                        </RewardValue>
                    </RewardBox>

                    <Button
                        onClick={handleClaimReward}
                        text={'Claim Reward'}
                        disabled={Number(myCurrentReward) === 0}
                    />
                </StatsFooter>
            </Content>
        </Container>
    )
}

export default Statistics

const Flex = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 13px 0;
`

const StatsContainer = styled.div`
    padding: 20px;
    border-radius: 10px;
    background: ${(props) => props.theme.colors.placeholder};
    .blockie {
        border-bottom: 1px solid ${(props) => props.theme.colors.border};
        &:last-child {
            border: 0;
        }
    }
    @media (max-width: 767px) {
        margin-top: 20px;
    }
`
const Container = styled.div`
    flex: 3;
    ${({ theme }) => theme.mediaWidth.upToSmall`
   margin-bottom:20px;
 `}
`

const Content = styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100% - 61px);
    justify-content: space-between;
`

const StatsFooter = styled.div`
    padding: 20px;
    border-radius: 0 0 15px 15px;
    background: ${(props) => props.theme.colors.background};
    button {
        margin-top: 15px;
        width: 100%;
    }
`

const RewardBox = styled.div`
    /* display: flex;
    align-items: center;
    justify-content: space-between; */
`

const RewardValue = styled.div`
    margin-top: 10px;
    display: flex;
    align-items: center;
    font-size: 15px;
    img {
        margin-left: 5px;
    }
    span {
        display: inline-block;
        margin: 0 5px;
    }
`
const RewardLabel = styled.div`
    color: ${(props) => props.theme.colors.secondary};
    font-size: 14px;
    ${({ theme }) => theme.mediaWidth.upToSmall`
        font-size: 14px;
        margin-top:0;
    `}
`

const Label = styled.div<{ color?: 'primary' | 'secondary' }>`
    font-size: ${(props) => props.theme.font.small};
    color: ${({ theme, color }) =>
        color ? theme.colors[color] : theme.colors.primary};
    display: flex;
    align-items: center;
    svg {
        margin-right: 5px;
    }
`

const Value = styled.div`
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.primary};
    display: flex;
    align-items: center;
    img {
        opacity: 0.8;
        margin-right: 5px;
        max-width: 20px;
    }
`
