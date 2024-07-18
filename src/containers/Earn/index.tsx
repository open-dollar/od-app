import styled from 'styled-components'
import { useStoreActions, useStoreState } from '~/store'
import { useActiveWeb3React } from '~/hooks'
import { useEffect, useMemo, useState } from 'react'
import useGeb from '~/hooks/useGeb'
import Button from '~/components/Button'
import { ExternalLink } from 'react-feather'
import { POOLS } from '~/utils'
import PoolBlock from './PoolBlock'
import { JSX } from 'react/jsx-runtime'
import { PoolData } from '@opendollar/sdk'
import Skeleton from 'react-loading-skeleton'
import EarnBlock from './EarnBlock'
import { getTokenLogo } from '~/utils'

interface Cache {
    [key: string]: PoolData
}

const Earn = () => {
    const geb = useGeb()
    const { account } = useActiveWeb3React()
    const { nitroPoolsModel: nitroPoolsState } = useStoreState((state) => state)
    const { nitroPoolsModel: nitroPoolsActions } = useStoreActions((state) => state)
    const { nitroPools } = nitroPoolsState

    const [cachedPools, setCachedPools] = useState<Cache>({})

    const fetchPools = useMemo(() => {
        if (!geb) return () => {}
        return async () => {
            try {
                const poolResults = await Promise.all(
                    POOLS.map(async (pool: { camelotPoolAddress: string; nitroPoolAddress: string }) => {
                        const cacheKey = `${account}-${pool.camelotPoolAddress}-${pool.nitroPoolAddress}`
                        if (cachedPools[cacheKey]) {
                            return cachedPools[cacheKey]
                        }
                        const poolData = await nitroPoolsActions.fetchNitroPool({
                            userAddress: account ?? undefined,
                            camelotPoolAddress: pool.camelotPoolAddress,
                            nitroPoolAddress: pool.nitroPoolAddress,
                            geb,
                        })
                        setCachedPools((prev) => ({
                            ...prev,
                            [cacheKey]: poolData,
                        }))
                        return poolData
                    })
                )
                return poolResults
            } catch (e) {
                console.error(`Error fetching Nitro Pools data: ${e}`)
                return []
            }
        }
    }, [account, geb, nitroPoolsActions, cachedPools])

    useEffect(() => {
        fetchPools()
    }, [fetchPools])

    const handleClick = () => {
        window.open('https://discord.opendollar.com/', '_blank')
    }

    return (
        <Container>
            <Title>Earn</Title>
            <SubHeader>incentivized pools and strategies</SubHeader>
            <Text>
                <p>Earn additional yield by staking your LP position in Camelot Nitro.</p>
                <p>
                    When creating a OD-ETH position, use the "Auto" mode provided by Gamma. <br></br>See full
                    instructions{' '}
                    <Link
                        href="https://www.opendollar.com/blog/the-earn-page-and-new-camelot-nitro-pool"
                        target="_blank"
                    >
                        here
                    </Link>
                    .
                </p>
            </Text>
            <Pools>
                <PoolsHeader>Strategies</PoolsHeader>
                <EarnBlock
                    status="Active"
                    url="https://app.creditguild.org/earn"
                    apy="Variable"
                    tvl="$99k"
                    rewardToken1Symbol="OD"
                    rewardToken2Symbol="ODG, and GUILD"
                    title={
                        <>
                            Credit Guild <img src={getTokenLogo('OD')} alt={''} width={'50px'} />
                        </>
                    }
                />
                {nitroPools.length > 0 ? (
                    POOLS?.map(
                        (
                            pool: JSX.IntrinsicAttributes & { nitroPoolAddress: string; nitroPoolData: PoolData },
                            i: number
                        ) => <PoolBlock {...pool} nitroPoolData={nitroPools[i]} key={`${pool.nitroPoolAddress}-pool`} />
                    )
                ) : (
                    <Skeleton height={185} count={3} style={{ marginBottom: '30px' }} />
                )}
            </Pools>

            <BtnWrapper>
                <Button data-test-id="steps-btn" id={'suggest-pool-btn'} secondary onClick={handleClick}>
                    suggest a new pool <ExternalLink />
                </Button>
            </BtnWrapper>
        </Container>
    )
}

const Container = styled.div`
    max-width: 1362px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
    color: ${(props) => props.theme.colors.accent};
`

const Title = styled.h2`
    font-size: 34px;
    font-weight: 700;
    font-family: ${(props) => props.theme.family.headers};
    color: ${(props) => props.theme.colors.accent};
`

const SubHeader = styled.h3`
    text-transform: uppercase;
    font-family: ${(props) => props.theme.family.headers};
    font-size: 22px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.tertiary};
    margin-bottom: 20px;
`

const Text = styled.div`
    background-color: rgba(202, 234, 255, 0.3);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0);
    border-radius: 3px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    font-size: ${(props) => props.theme.font.default};
    border-radius: 3px;
    margin-bottom: 30px;

    p {
        margin-bottom: 10px;
    }

    a {
        text-decoration: underline;
        color: ${(props) => props.theme.colors.tertiary};
    }
`

const PoolsHeader = styled.h2`
    font-size: 34px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.accent};
    margin-bottom: 20px;
`

const Pools = styled.div`
    margin-bottom: 30px;
`

const BtnWrapper = styled.div`
    width: max-content;
    margin-right: auto;
    margin-left: auto;
    button {
        text-transform: uppercase;
        font-weight: 700;
        font-size: 18px;
        padding: 17px 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
`

const Link = styled.a``

export default Earn
