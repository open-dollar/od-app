import { useState, useEffect } from 'react'
import { ExternalLink } from 'react-feather'

import { useActiveWeb3React } from '~/hooks'
import Loader from '~/components/Loader'
import Button from '~/components/Button'
import useFuulSDK from '~/hooks/useFuulSDK'
import { QUESTS } from './quests'
import QuestBlock from './QuestBlock'

import styled from 'styled-components'

const Bolts = () => {
    const { account } = useActiveWeb3React()
    const { getUserData } = useFuulSDK()

    const [userFuulData, setUserFuulData] = useState<any>('')
    const [hasFetched, setHasFetched] = useState<boolean>(false)

    useEffect(() => {
        if (account && !hasFetched) {
            setHasFetched(true)
            ;(async () => {
                try {
                    // const data = await getUserData(account)
                    const data = await getUserData('0x000000000000000000000000000000000000dead')
                    console.log('data', data)
                    if (data) {
                        setUserFuulData(data)
                    }
                } catch (err) {
                    console.error('Error fetching user fuul data:', err)
                }
            })()
        }
    }, [account, getUserData, hasFetched])

    return (
        <Container>
            <Title>Bolts</Title>
            <SubHeader>Welcome Vault Keepers!</SubHeader>
            <Text>
                <p>
                    Complete the quests below to earn Bolts.
                    <br />
                    Deposits, borrows, and LPs are awarded points based on their ETH equivalents in value.
                </p>
                <p>
                    For program details, see our{' '}
                    <Link href="https://www.opendollar.com/blog/vault-keeper-program" target="_blank">
                        blog
                    </Link>
                    .
                </p>
            </Text>
            <Section>
                <SectionHeader>Status</SectionHeader>
                <BoltsDetails>
                    <div>Bolts: {userFuulData.points}</div>
                    <div>Rank: {userFuulData.rank}</div>
                </BoltsDetails>
            </Section>
            <Section>
                <SectionHeader>Earn Bolts 🔩</SectionHeader>
                {QUESTS.map((quest, index) => (
                    <QuestBlock key={index} {...quest} />
                ))}
            </Section>
            <BtnWrapper>
                <Button
                    data-test-id="steps-btn"
                    id={'suggest-pool-btn'}
                    secondary
                    onClick={() => {
                        window.open('https://discord.opendollar.com/', '_blank')
                    }}
                >
                    suggest a new quest <ExternalLink />
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
    background-color: #6396ff26;
    backdrop-filter: blur(10px);

    padding: 20px;
    font-size: ${(props) => props.theme.font.default};
    border-radius: 3px;

    p {
        margin-bottom: 10px;
    }

    a {
        text-decoration: underline;
        color: ${(props) => props.theme.colors.tertiary};
    }
    margin-bottom: 30px;
`
const BoltsDetails = styled.div`
    padding: 20px;
    margin-bottom: 30px;

    background-color: rgba(255, 255, 255, 0);
    backdrop-filter: blur(10px);

    border: 1px solid rgba(255, 255, 255, 0);
    border-radius: 3px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

    text-transform: uppercase;
    font-weight: 700;
    font-size: ${(props) => props.theme.font.default};

    div {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
`

const SectionHeader = styled.h2`
    font-size: 34px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.accent};
    margin-bottom: 20px;
`
const Section = styled.div``

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

export default Bolts
