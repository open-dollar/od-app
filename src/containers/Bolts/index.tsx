import { useState, useEffect } from 'react'
import { ExternalLink } from 'react-feather'

import { useActiveWeb3React } from '~/hooks'
import Button from '~/components/Button'
import useFuulSDK from '~/hooks/useFuulSDK'
import { QUESTS } from './quests'
import QuestBlock from './QuestBlock'
import Image from '~/assets/quests-img.png'

import styled from 'styled-components'
import Leaderboard from './Leaderboard'

const Bolts = () => {
    const { account } = useActiveWeb3React()
    const { getUserData } = useFuulSDK()

    const [userFuulData, setUserFuulData] = useState<any>({ rank: '', points: '' })
    const [hasFetched, setHasFetched] = useState<boolean>(false)

    useEffect(() => {
        if (account && !hasFetched) {
            setHasFetched(true)
            ;(async () => {
                try {
                    const data = await getUserData(account)
                    // const data = await getUserData('0x000000000000000000000000000000000000dead')
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
            <Title>Bolts 🔩</Title>
            <SubHeader>Welcome Vault Keepers!</SubHeader>
            <MessageBox>
                <img src={Image} alt="" />
                <Text>
                    <h3>Complete the quests below to earn Bolts.</h3>
                    <p>
                        Deposits, borrows, and LPs are awarded Bolts based on their equivalent value in ETH. For program
                        details, see our{' '}
                        <Link href="https://www.opendollar.com/blog/vault-keeper-program" target="_blank">
                            blog
                        </Link>
                        .
                    </p>
                </Text>
            </MessageBox>
            <Section>
                <SectionHeader>Status</SectionHeader>
                <BoltsDetails>
                    <BoltsDetailsRow>EARNED: {userFuulData.points}</BoltsDetailsRow>
                    <BoltsDetailsRow>RANK: {userFuulData.rank}</BoltsDetailsRow>
                </BoltsDetails>
            </Section>
            <Section>
                <SectionHeader>Quests</SectionHeader>
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
                    Suggest a Quest <ExternalLink />
                </Button>
            </BtnWrapper>
        </Container>
    )
}

const Container = styled.div`
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
        padding: 0 10px;
    }
    color: ${(props) => props.theme.colors.accent};
`

const MessageBox = styled.div`
    border-radius: 4px;
    background: ${(props) => props.theme.colors.gradientBg};
    color: white;
    padding-left: 28px;
    display: flex;
    align-items: center;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

    & h3 {
        font-size: ${(props) => props.theme.font.large};
        font-weight: 700;
        font-family: ${(props) => props.theme.family.headers};
        margin-bottom: 10px;
        line-height: 36px;
    }

    a {
        text-decoration: underline;
        color: white;
    }
`

const Text = styled.div`
    max-width: 400px;
`

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

const BoltsDetails = styled.div`
    padding: 20px;
    margin-bottom: 30px;
    background-color: rgba(202, 234, 255, 0.3);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0);
    border-radius: 4px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    font-weight: 700;
    font-size: ${(props) => props.theme.font.default};
    display: flex;
    align-items: start;
    flex-direction: column;
    div {
        display: flex;
        justify-content: space-between;
    }
    @media (max-width: 767px) {
        padding: 15px;
        font-size: ${(props) => props.theme.font.small};
    }
`

const BoltsDetailsRow = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: start;
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
