import { useStoreState } from 'easy-peasy'
import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, Plus } from 'react-feather'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import LinkButton from '~/components/LinkButton'
import { useActiveWeb3React } from '~/hooks'
import useGeb from '~/hooks/useGeb'
import { useStoreActions } from 'easy-peasy'

import { formatWithCommas, getTokenLogo } from '~/utils'
import Loader from '~/components/Loader'
import { BigNumber } from 'ethers'

const pools = [
    {
        poolAddress: '0x64ca43A1C1c38b06757152fdf0CC02d0F84407CF',
        apy: '2.90%',
        link: 'https://app.camelot.exchange/pools/0x824959a55907d5350e73e151Ff48DabC5A37a657',
    },
]

interface PoolSettings {
    [key: string]: {
        startDate: BigNumber
        endDate: BigNumber
    }
}

interface Pool {
    apy: string
    settings: PoolSettings
    [key: string]: any
}

const EarnDetails = () => {
    const [nitroPool, setNitroPool] = useState<Pool | null>(null)
    const history = useHistory()

    const geb = useGeb()
    const { account } = useActiveWeb3React()
    // @to-do for some reason the new model is not being tracked in store type, but it is available as a function
    //  @ts-ignore
    const { nitroPoolsModel: nitroPoolsState } = useStoreState((state) => state)
    // @ts-ignore
    const { nitroPoolsModel: nitroPoolsActions } = useStoreActions((state) => state)
    const { nitroPools } = nitroPoolsState

    useEffect(() => {
        if (!geb) return
        console.log()
        async function fetchPool() {
            try {
                await nitroPoolsActions.fetchNitroPool({
                    geb,
                    poolAddress: '0x64ca43A1C1c38b06757152fdf0CC02d0F84407CF',
                    userAddress: account ?? undefined,
                })
                setNitroPool(nitroPools[0])
            } catch (e) {
                throw new Error(`Error fetching nitropools data ${e}`)
            }
        }
        fetchPool()
    }, [account, geb, nitroPoolsActions])

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

        diffSec = diffSec % 60
        const remainingMin = diffMin % 60
        const remainingHrs = diffHrs % 24

        return `${diffDays} D ${remainingHrs}h ${remainingMin}min ${diffSec} sec`
    }

    return (
        <>
            {nitroPools.length > 0 ? (
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
                        <LinkBtnContainer>
                            <LinkButton id="create-safe" disabled={false} url={'/vaults/create'}>
                                <Plus />
                                Deposit funds
                            </LinkButton>
                        </LinkBtnContainer>
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
                                    <Value>{pools[0].apy}</Value>
                                </Item>
                                <Item>
                                    <Label>Pending Rewards</Label>
                                    <Value>{nitroPool?.rewardTokens[0].symbol}</Value>
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
                        <FooterHeader>
                            My deposit
                            <LinkBtnContainer>
                                <LinkButton id="create-safe" disabled={false} url={'/vaults/create'}>
                                    Manage Position
                                </LinkButton>
                            </LinkBtnContainer>
                        </FooterHeader>
                        <Wrapper>
                            <FooterWrapper>
                                <Item>
                                    <Label>Average APR</Label>
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

const LinkBtnContainer = styled.div`
    max-width: 230px;
    a {
        color: white;
        outline: none;
        cursor: pointer;
        min-width: 100px;
        padding: 12px 40px;
        font-weight: 700;
        background: ${(props) => props.theme.colors.gradientBg};
        border-radius: 3px;
        transition: all 0.3s ease;
        font-family: ${(props) => props.theme.family.headers};
    }

    svg {
        margin-right: 10px;
    }

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
