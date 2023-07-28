'use client'

import { useEffect, useContext } from 'react'
import { SYSTEMSTATE_QUERY } from '../../utils/queries'
import { useQuery } from '@apollo/client'
import { formatNumber, getCollateralRatio } from '../../utils/helpers'
import { useStats } from '../../hooks/useStats'
import styled from 'styled-components'
import GridContainer from '~/components/GridContainer'
import Loader from '~/components/Loader'
import LinkButton from '~/components/LinkButton'

// import { FaExternalLinkSquareAlt } from 'react-icons/fa';

const Stats = () => {
    const { loading, data } = useQuery(SYSTEMSTATE_QUERY)
    const stats = useStats()

    useEffect(() => {
        if (data && stats) {
            stats.setStandardStats(
                data.systemStates[0].safeCount,
                data.systemStates[0].totalActiveSafeCount,
                data.systemStates[0].globalDebt,
                data.systemStates[0].currentRedemptionPrice.value,
                data.redemptionRates[0].annualizedRate,
                data.collateralPrices[0].collateral.totalCollateral,
                data.collateralPrices[0].collateral.currentPrice.value,
                data.dailyStats[0].marketPriceUsd,
                data.safes[0].collateralType.currentPrice.collateral.liquidationCRatio,
                data.safes[0].collateralType.currentPrice.liquidationPrice
            )
        }
    }, [data])

    const Text = ({ children }) => <p>{children}</p>
    const SimpleGrid = ({ children }) => <div>{children}</div>
    const ChakraLink = ({ children }) => <div>{children}</div>

    return (
        <Container>
            <Text fontSize={{ lg: '28px', sm: '18px' }} mb="1rem">
                Global Stats
            </Text>
            {!loading ? (
                <>
                    <Wrapper>
                        <Container
                            direction="column"
                            mr={{ lg: '2rem', sm: 0 }}
                            alignItems="left"
                            justifyContent="center"
                        >
                            <Text
                                fontSize={{ lg: '28px', sm: '18px' }}
                                mb=".5rem"
                                background="linear-gradient(to right, #41c1d0, #1a6c51)"
                                backgroundClip="text"
                                fontWeight="extrabold"
                            >
                                {new Intl.NumberFormat('en-US', {
                                    style: 'decimal',
                                    minimumFractionDigits: 0,
                                }).format(Number(stats.safeCount))}
                            </Text>
                            <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight="bold">
                                Total Safes
                            </Text>
                        </Container>
                        <Container direction="column" alignItems="left" justifyContent="center">
                            <Text
                                fontSize={{ lg: '28px', sm: '18px' }}
                                mb=".5rem"
                                background="linear-gradient(to right, #41c1d0, #1a6c51)"
                                backgroundClip="text"
                                fontWeight="extrabold"
                            >
                                {stats.activeSafesCount}
                            </Text>
                            <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight="bold">
                                Active Safes
                            </Text>
                        </Container>
                        <Container
                            direction="column"
                            mr={{ lg: '2rem', sm: 0 }}
                            alignItems="left"
                            justifyContent="center"
                        >
                            <Text
                                fontSize={{ lg: '28px', sm: '18px' }}
                                mb=".5rem"
                                background="linear-gradient(to right, #41c1d0, #1a6c51)"
                                backgroundClip="text"
                                fontWeight="extrabold"
                            >
                                ${' '}
                                {new Intl.NumberFormat('en-US', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(formatNumber(stats.collateralPrice)))}{' '}
                                USD
                            </Text>
                            <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight="bold">
                                ETH Price
                            </Text>
                        </Container>
                        <Container
                            direction="column"
                            mr={{ lg: '2rem', sm: 0 }}
                            alignItems="left"
                            justifyContent="center"
                        >
                            <Text
                                fontSize={{ lg: '28px', sm: '18px' }}
                                mb=".5rem"
                                background="linear-gradient(to right, #41c1d0, #1a6c51)"
                                backgroundClip="text"
                                fontWeight="extrabold"
                            >
                                {new Intl.NumberFormat('en-US', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(formatNumber(stats.globalCollateral)))}
                            </Text>
                            <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight="bold">
                                ETH Collateral
                            </Text>
                        </Container>
                        <Container
                            direction="column"
                            mr={{ lg: '2rem', sm: 0 }}
                            alignItems="left"
                            justifyContent="center"
                        >
                            <Text
                                fontSize={{ lg: '28px', sm: '18px' }}
                                mb=".5rem"
                                background="linear-gradient(to right, #41c1d0, #1a6c51)"
                                backgroundClip="text"
                                fontWeight="extrabold"
                            >
                                {new Intl.NumberFormat('en-US', {
                                    style: 'decimal',
                                    minimumFractionDigits: 0,
                                }).format(Number(formatNumber(stats.globalDebt, 0, true)))}
                            </Text>
                            <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight="bold">
                                Minted OD Debt
                            </Text>
                        </Container>

                        <Container
                            direction="column"
                            mr={{ lg: '2rem', sm: 0 }}
                            alignItems="left"
                            justifyContent="center"
                        >
                            <Text
                                fontSize={{ lg: '28px', sm: '18px' }}
                                mb=".5rem"
                                background="linear-gradient(to right, #41c1d0, #1a6c51)"
                                backgroundClip="text"
                                fontWeight="extrabold"
                            >
                                {getCollateralRatio(
                                    stats.globalCollateral,
                                    stats.globalDebt,
                                    stats.liquidationPrice,
                                    stats.liquidationCRatio
                                )}
                                %
                            </Text>
                            <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight="bold">
                                Collateral Ratio
                            </Text>
                        </Container>

                        <Container
                            direction="column"
                            mr={{ lg: '2rem', sm: 0 }}
                            alignItems="left"
                            justifyContent="center"
                        >
                            <Text
                                fontSize={{ lg: '28px', sm: '18px' }}
                                mb=".5rem"
                                background="linear-gradient(to right, #41c1d0, #1a6c51)"
                                backgroundClip="text"
                                fontWeight="extrabold"
                            >
                                $ {Number(formatNumber(stats.raiRedemptionPrice)).toLocaleString('en-US')} USD
                            </Text>
                            <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight="bold">
                                OD Redemption Price
                            </Text>
                        </Container>
                        <Container
                            direction="column"
                            mr={{ lg: '2rem', sm: 0 }}
                            alignItems="left"
                            justifyContent="center"
                        >
                            <Text
                                fontSize={{ lg: '28px', sm: '18px' }}
                                mb=".5rem"
                                background="linear-gradient(to right, #41c1d0, #1a6c51)"
                                backgroundClip="text"
                                fontWeight="extrabold"
                            >
                                {new Intl.NumberFormat('en-US', {
                                    style: 'decimal',
                                    minimumFractionDigits: 3,
                                }).format(Number((stats.raiRedemptionRate - 1) * 100))}{' '}
                                %
                            </Text>
                            <Text fontSize={{ lg: '14px', sm: '12px' }} fontWeight="bold">
                                OD Redemption Rate APY
                            </Text>
                        </Container>
                    </Wrapper>
                    <LinkWrapper>
                        <LinkButton
                            id="stats"
                            text={'Click for more stats..'}
                            url={`https://stats.reflexer.finance/`}
                            color={'blueish'}
                        />
                    </LinkWrapper>
                </>
            ) : (
                <Loader />
            )}
        </Container>
    )
}
export default Stats

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(8, 1fr);
`

const LinkWrapper = styled.div`
  max-width: 200px;
  margin-left: auto;
`

const Container = styled.div`
    max-width: 880px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`

const Inner = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const LabelContainer = styled.div`
    max-width: ${(props) => props.theme.global.gridMaxWidth};
    margin: 0 auto 20px auto;
`
