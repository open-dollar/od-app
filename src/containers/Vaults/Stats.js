'use client'

import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { fetchAnalyticsData } from '@opendollar/sdk/lib/virtual/virtualAnalyticsData'
import { formatDataNumber, multiplyWad } from '~/utils'
import useGeb from '~/hooks/useGeb'
import { fetchPoolData } from '@opendollar/sdk'
import { BigNumber } from 'ethers'

const Stats = () => {
    const geb = useGeb()
    const [state, setState] = useState({
        totalVaults: '',
        wETHBalance: '',
        odBalance: '',
        totalCollateralSum: '',
    })

    useEffect(() => {
        async function fetchData() {
            if (geb) {
                let totalLockedValue = BigNumber.from('0')
                try {
                    const [poolData, analyticsData] = await Promise.all([fetchPoolData(geb), fetchAnalyticsData(geb)])
                    Object.entries(analyticsData?.tokenAnalyticsData).map(([key, value]) => {
                        const lockedAmountInUsd = multiplyWad(
                            value?.lockedAmount?.toString(),
                            value?.currentPrice?.toString()
                        )
                        totalLockedValue = totalLockedValue.add(lockedAmountInUsd)
                    })
                    setState((prevState) => ({
                        ...prevState,
                        totalVaults: analyticsData.totalVaults,
                        wETHBalance: formatDataNumber(poolData.WETH_balance, 18, 2, false),
                        odBalance: formatDataNumber(poolData.OD_balance, 18, 2, false),
                        totalCollateralSum: formatDataNumber(totalLockedValue.toString(), 18, 2, true, true),
                    }))
                } catch (error) {
                    console.error('Error fetching data:', error)
                }
            }
        }

        fetchData()
    }, [geb])

    return (
        <ComponentContainer>
            <Header>
                <Title>Stats</Title>
                <LinkWrapper>
                    <a
                        style={{ color: '#1499DA', fontWeight: '600', fontSize: '14px' }}
                        href="https://stats.opendollar.com/"
                        target="_blank"
                    >
                        View All Stats
                    </a>
                </LinkWrapper>
            </Header>
            <Wrapper>
                <Container>
                    <StatItem>
                        <TextHeader>Total Vaults</TextHeader>
                        <Text
                            fontSize={{ lg: '28px', sm: '18px' }}
                            mb=".5rem"
                            background="linear-gradient(to right, #41c1d0, #1a6c51)"
                            backgroundClip="text"
                            fontWeight="extrabold"
                        >
                            {state?.totalVaults}
                        </Text>
                    </StatItem>
                </Container>
                <Container>
                    <StatItem>
                        <TextHeader>ETH Collateral</TextHeader>
                        <Text
                            fontSize={{ lg: '28px', sm: '18px' }}
                            mb=".5rem"
                            background="linear-gradient(to right, #41c1d0, #1a6c51)"
                            backgroundClip="text"
                            fontWeight="extrabold"
                        >
                            {state?.wETHBalance} ETH
                        </Text>
                    </StatItem>
                </Container>
                <Container>
                    <StatItem>
                        <TextHeader>Minted OD Debt</TextHeader>
                        <Text
                            fontSize={{ lg: '28px', sm: '18px' }}
                            mb=".5rem"
                            background="linear-gradient(to right, #41c1d0, #1a6c51)"
                            backgroundClip="text"
                            fontWeight="extrabold"
                        >
                            {state?.odBalance} OD
                        </Text>
                    </StatItem>
                </Container>

                <Container>
                    <StatItem>
                        <TextHeader>Total Collateral Locked</TextHeader>
                        <Text
                            fontSize={{ lg: '28px', sm: '18px' }}
                            mb=".5rem"
                            background="linear-gradient(to right, #41c1d0, #1a6c51)"
                            backgroundClip="text"
                            fontWeight="extrabold"
                        >
                            {state?.totalCollateralSum}
                        </Text>
                    </StatItem>
                </Container>
            </Wrapper>
        </ComponentContainer>
    )
}
export default Stats

const Text = styled.div`
    font-size: 13px;
    font-weight: 600;
    line-height: 21px;
`

const StatItem = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: end;
    @media (max-width: 767px) {
        align-items: start;
    }
`

const TextHeader = styled.div`
    font-size: 13px;
    color: ${(props) => props.theme.colors.secondary};
    letter-spacing: -0.09px;
    line-height: 21px;
    @media (max-width: 767px) {
        font-size: ${(props) => props.theme.font.small};
    }
`

const Header = styled.div`
    margin-bottom: 16px;
    display: flex;
`

const Title = styled.div`
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
`

const Wrapper = styled.div`
    display: flex;
    background: #002b40;
    width: 100%;
    margin-bottom: 24px;
    justify-content: space-between;
    border-radius: 15px;
`

const LinkWrapper = styled.div`
    max-width: 200px;
    margin-left: auto;
`

const ComponentContainer = styled.div`
    max-width: 880px;
    margin: 20px auto;
    padding: 0 15px;
`

const Container = styled.div`
    max-width: 880px;
    margin: 16px;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`
