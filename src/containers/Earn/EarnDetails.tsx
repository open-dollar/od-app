import { useStoreState } from 'easy-peasy'
import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft } from 'react-feather'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useActiveWeb3React } from '~/hooks'
import useGeb from '~/hooks/useGeb'
import { useStoreActions } from 'easy-peasy'

import { formatWithCommas, getTokenLogo } from '~/utils'
import Loader from '~/components/Loader'
import { BigNumber } from 'ethers'
import Camelot from '~/components/Icons/Camelot'

interface PoolSettings {
    [key: string]: {
        startDate: BigNumber
        endDate: BigNumber
    }
}

interface Pool {
    apy: number
    settings: PoolSettings
    [key: string]: any
}

const EarnDetails = () => {
    const [nitroPool, setNitroPool] = useState<Pool | null>(null)
    const history = useHistory()
    const location = useLocation()

    const geb = useGeb()
    const { account } = useActiveWeb3React()
    // @to-do for some reason the new model is not being tracked in store type, but it is available as a function
    //  @ts-ignore
    const { nitroPoolsModel: nitroPoolsState } = useStoreState((state) => state)
    // @ts-ignore
    const { nitroPoolsModel: nitroPoolsActions } = useStoreActions((state) => state)
    const { nitroPools } = nitroPoolsState
    const address = location.pathname.split('/').pop()
    useEffect(() => {
        if (!geb) return

        async function fetchPool() {
            try {
                await nitroPoolsActions.fetchNitroPool({
                    geb,
                    poolAddress: address,
                    userAddress: account ?? undefined,
                })
                setNitroPool(nitroPools[0])
            } catch (e) {
                throw new Error(`Error fetching nitropools data ${e}`)
            }
        }
        fetchPool()
    }, [account, geb, nitroPoolsActions, address, nitroPools])

    const handleBack = useCallback(() => {
        history.push(`/earn`)
    }, [history])

    const getDates = () => {
        const start = new Date(Number(nitroPool?.settings.startTime) * 1000)
        const end = new Date(Number(nitroPool?.settings.endTime) * 1000)
        const now = new Date()
        return { start, end, now }
    }

    const getTimePeriod = () => {
        const { start, end, now } = getDates()
        return now > start && now < end ? 'Active' : 'Inactive'
    }

    const getDuration = () => {
        const { start, end } = getDates()

        const yearsDifference = end.getFullYear() - start.getFullYear()
        const monthsDifference = end.getMonth() - start.getMonth()
        let totalMonths = yearsDifference * 12 + monthsDifference

        const startCopy = new Date(start)
        startCopy.setMonth(startCopy.getMonth() + totalMonths)

        let remainingDays = (end.getTime() - startCopy.getTime()) / (1000 * 60 * 60 * 24)

        if (remainingDays < 0) {
            totalMonths -= 1
            startCopy.setMonth(startCopy.getMonth() - 1)
            remainingDays = (end.getTime() - startCopy.getTime()) / (1000 * 60 * 60 * 24)
        }

        return `${totalMonths} months ${Math.floor(remainingDays)} days`
    }

    const getEndDuration = (): string => {
        const { end, now } = getDates()

        const diffMs = end.getTime() - now.getTime()

        let diffSec = Math.floor(diffMs / 1000)
        const diffMin = Math.floor(diffSec / 60)
        const diffHrs = Math.floor(diffMin / 60)
        const diffDays = Math.floor(diffHrs / 24)

        const remainingMin = diffMin % 60
        const remainingHrs = diffHrs % 24

        return `${diffDays}D ${remainingHrs}h ${remainingMin}min`
    }

    return (
        <>
            {nitroPool ? (
                <Container>
                    <BackBtn id="back-btn" onClick={handleBack}>
                        <ChevronLeft size={18} /> BACK
                    </BackBtn>
                    <PoolHeader>
                        <Title>
                            <img src={getTokenLogo(nitroPool?.collateralTokens[0]?.symbol)} alt={''} width={'50px'} />
                            <img src={getTokenLogo(nitroPool?.collateralTokens[1]?.symbol)} alt={''} width={'50px'} />
                            <PoolTitle>{`${nitroPool?.collateralTokens[0]?.symbol} - ${nitroPool?.collateralTokens[1]?.symbol}`}</PoolTitle>
                        </Title>
                        <ExternalLink href={`https://app.camelot.exchange/nitro/${address}`} target="_blank">
                            <Camelot />
                            VIEW ON CAMELOT
                        </ExternalLink>
                    </PoolHeader>
                    <Body>
                        <Wrapper>
                            <ColWrapper>
                                <Item>
                                    <Label>Total value locked</Label>
                                    <Value>${formatWithCommas(nitroPool?.tvl?.toFixed(2) || 0)}</Value>
                                </Item>
                                <Item>
                                    <Label>APY</Label>
                                    <Value>{nitroPool.apy}</Value>
                                </Item>
                                <Item>
                                    <Label>Pending Rewards</Label>
                                    <Value>
                                        {nitroPool.rewardTokens?.map((token: { symbol: string }, i: number) => {
                                            if (i === nitroPool.rewardTokens.length - 1) {
                                                return token.symbol
                                            }
                                            return `${token.symbol}, `
                                        })}
                                    </Value>
                                </Item>
                            </ColWrapper>
                        </Wrapper>
                        <Wrapper>
                            <ColWrapper>
                                <Item>
                                    <Label>Status</Label>
                                    <Value>{getTimePeriod()}</Value>
                                </Item>
                                <Item>
                                    <Label>Duration</Label>
                                    <Value>{getDuration()}</Value>
                                </Item>
                                <Item>
                                    <Label>End in</Label>
                                    <Value>{getEndDuration()}</Value>
                                </Item>
                            </ColWrapper>
                        </Wrapper>
                    </Body>
                    <Footer>
                        <FooterHeader>My deposit</FooterHeader>

                        <Wrapper>
                            <FooterWrapper>
                                <Item>
                                    <Label>Average APY</Label>
                                    <Value>0.00%</Value>
                                </Item>
                                <Item>
                                    <Label>Total in Deposit</Label>
                                    <Value>0.0 OD-ETH: </Value>
                                </Item>
                                <Item>
                                    <Label>Pending rewards</Label>
                                    <Value>0.0 ODG: </Value>
                                </Item>
                            </FooterWrapper>
                        </Wrapper>
                    </Footer>
                </Container>
            ) : (
                <LoaderContainer>
                    <Loader color="#1A74EC" width="150px" />
                </LoaderContainer>
            )}
        </>
    )
}

export default EarnDetails

const ExternalLink = styled.a`
    display: flex;
    align-items: center;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
    font-size: 14px;
    color: ${(props) => props.theme.colors.primary};
`

const Container = styled.div`
    max-width: 880px;
    margin: 50px auto;
    padding: 0 15px;
    display: flex;
    flex-direction: column;
    gap: 50px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`

const LoaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
`

const PoolTitle = styled.div`
    font-size: 34px;
    font-family: ${(props) => props.theme.family.headers};
    color: ${(props) => props.theme.colors.accent};
    font-weight: 700;

    margin-left: 5px;

    span {
        font-weight: 500;
        color: ${(props) => props.theme.colors.primary};
    }
`

const BackBtn = styled.div`
    font-size: 16px;
    display: flex;
    align-items: center;
    font-weight: 700;
    font-family: 'Open Sans', sans-serif;
    color: #1c293a;
    cursor: pointer;
    max-width: fit-content;
    svg {
        margin-right: 5px;
    }

    transition: opacity 0.3s ease;
    &:hover {
        opacity: 0.8;
    }
`

const PoolHeader = styled.div`
    display: flex;
    justify-content: space-between;

    @media (max-width: 767px) {
        flex-direction: column;
        align-items: center;

        gap: 30px;
    }
`

const Title = styled.h2`
    display: flex;
`

const Body = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;

    @media (max-width: 767px) {
        flex-direction: column;
    }
`

const Wrapper = styled.div`
    background-color: #ffffff;
    padding: 20px;
    border-radius: 4px;
    flex: 1;
    margin-bottom: 15px;
`

const Footer = styled.div``

const Label = styled.div`
    font-size: 16px;
    color: ${(props) => props.theme.colors.accent};
`

const Value = styled.div`
    font-size: 18px;
    color: ${(props) => props.theme.colors.primary};
    font-weight: 700;
`

const ColWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
`

const Item = styled.div``

const FooterWrapper = styled.div`
    display: flex;
    justify-content: space-between;

    @media (max-width: 767px) {
        flex-direction: column;
        gap: 30px;
    }
`

const FooterHeader = styled.div`
    margin-bottom: 15px;
    font-size: 32px;
    font-weight: 700;
    font-family: ${(props) => props.theme.family.headers};
    color: ${(props) => props.theme.colors.accent};

    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    @media (max-width: 767px) {
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
`
