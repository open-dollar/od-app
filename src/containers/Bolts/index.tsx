import { useEffect } from 'react'
import { ExternalLink } from 'react-feather'
import { useActiveWeb3React } from '~/hooks'
import Button from '~/components/Button'
import { MULTIPLIERS, QUESTS } from './quests'
import QuestBlock from './QuestBlock'
import styled from 'styled-components'
import Leaderboard from '~/containers/Bolts/Leaderboard'
import { useStoreState, useStoreActions } from '~/store'
import DataCard from '~/containers/Analytics/DataCard'
import MetaTags from '~/components/MetaTags'
import metaInfo from '~/utils/metaInfo'

const Bolts = () => {
    const { account } = useActiveWeb3React()
    const userBoltsData = useStoreState((state) => state.boltsModel.userBoltsData)
    const leaderboardData = useStoreState((state) => state.boltsModel.leaderboardData)
    const boltsEarnedData = useStoreState((state) => state.boltsModel.boltsEarnedData)
    const multipliersData = useStoreState((state) => state.boltsModel.multipliersData)

    const fetchData = useStoreActions((actions) => actions.boltsModel.fetchData)

    useEffect(() => {
        fetchData({ account } as { account: string | null })
    }, [account, fetchData])
    return (
        <>
            <MetaTags page={metaInfo.bolts} />
            <Container>
                <Section>
                    <Title>Bolts</Title>
                    <SubHeader>Welcome Vault Keepers!</SubHeader>
                </Section>

                <Section>
                    <FlexMultipleRow>
                        <DataCard
                            title={'Your Bolts'}
                            value={userBoltsData.bolts ? parseInt(userBoltsData.bolts).toLocaleString() : '-'}
                            // description={val.description}
                        />
                        <DataCard
                            title={'Your Multiplier'}
                            value={userBoltsData.multiplier ? Number(userBoltsData.multiplier).toFixed(2) : '-'}
                            // description={"Multiplier"}
                        />
                    </FlexMultipleRow>
                </Section>

                <Section>
                    <SectionHeader>Leaderboard</SectionHeader>
                    <Leaderboard data={leaderboardData} userBoltsData={userBoltsData} />
                </Section>

                <Section>
                    <SectionHeader>Quests</SectionHeader>
                    {QUESTS(boltsEarnedData).map((quest, index) => (
                        <QuestBlock key={index} {...quest} />
                    ))}
                </Section>

                <Section>
                    <SectionHeader>Multipliers</SectionHeader>
                    {MULTIPLIERS(multipliersData).map((quest, index) => (
                        <QuestBlock key={index} {...quest} />
                    ))}
                </Section>

                <Section>
                    <BtnWrapper>
                        <Button
                            data-test-id="steps-btn"
                            id={'suggest-pool-btn'}
                            secondary
                            onClick={() => {
                                window.open('https://discord.opendollar.com/', '_blank')
                            }}
                        >
                            Suggest a Quest <ExternalLink />
                        </Button>
                    </BtnWrapper>
                </Section>
            </Container>
        </>
    )
}

const FlexMultipleRow = styled.div`
    display: flex;
    gap: 24px;
    margin-bottom: 24px;

    ${({ theme }) => theme.mediaWidth.upToSmall`
        display: block;

        & div {
            margin-bottom: 24px;
        }
    `}
`

const Container = styled.div`
    margin: 80px auto;
    max-width: 1362px;

    @media (max-width: 767px) {
        margin: 50px auto;
        padding: 0 10px;
    }
    color: ${(props) => props.theme.colors.accent};
`

// const MessageBox = styled.div`
//     max-width: 800px;
//     margin-left: auto;
//     margin-right: auto;
//     border-radius: 4px;
//     background: ${(props) => props.theme.colors.gradientBg};
//     color: white;
//     padding-left: 28px;
//     display: flex;
//     align-items: center;

//     & h3 {
//         font-size: 32px;
//         font-weight: 700;
//         font-family: ${(props) => props.theme.family.headers};
//         margin-bottom: 10px;
//         line-height: 36px;
//     }

//     a {
//         text-decoration: underline;
//         color: white;
//     }

//     @media (max-width: 767px) {
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         text-align: center;
//         padding-left: 0;
//         padding-bottom: 36px;
//         padding-left: 25px;
//         padding-right: 25px;
//         border-radius: 0;
//     }
// `

// const Text = styled.div`
//     max-width: 400px;
// `

const Title = styled.h2`
    font-size: 34px;
    font-weight: 700;
    font-family: ${(props) => props.theme.family.headers};
    color: ${(props) => props.theme.colors.accent};
    @media (max-width: 767px) {
        text-align: center;
    }
`

const SubHeader = styled.h3`
    text-transform: uppercase;
    font-family: ${(props) => props.theme.family.headers};
    font-size: 22px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.tertiary};
    margin-bottom: 20px;
    @media (max-width: 767px) {
        font-size: 18px;
        text-align: center;
    }
`

const SectionHeader = styled.h2`
    font-size: 34px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.accent};
    margin-bottom: 20px;
`

const Section = styled.div`
    padding: 0 15px;
    margin-bottom: 60px;
    @media (max-width: 767px) {
        padding: 0 10px;
    }
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

// const Link = styled.a``

export default Bolts
