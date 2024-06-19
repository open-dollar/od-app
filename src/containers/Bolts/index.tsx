import { useState, useEffect } from 'react'
import { ExternalLink } from 'react-feather'

import { useActiveWeb3React } from '~/hooks'
import Button from '~/components/Button'
import useFuulSDK from '~/hooks/useFuulSDK'
import { BoltsEarnedData, QUESTS } from './quests'
import QuestBlock from './QuestBlock'

import styled from 'styled-components'

const Bolts = () => {
    const { account } = useActiveWeb3React()
    const { getUserData } = useFuulSDK()

    const [userFuulData, setUserFuulData] = useState<any>({ rank: '', points: '' })
    const [boltsEarnedData, setBoltsEarnedData] = useState<any>({})
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
                        fetchBoltsEarnedData(account)
                    }
                } catch (err) {
                    console.error('Error fetching user fuul data:', err)
                }
            })()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, getUserData, hasFetched])

    type Conversion = {
        is_referrer: boolean
        conversion_id: number
        conversion_name: string
        total_amount: string
    }

    const fetchBoltsEarnedData = async (address: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/bolts?address=${address}`)
            // const response = await fetch(`https://bot.opendollar.com/api/bolts?address=${address}`)
            const result = await response.json()
            if (result.success) {
                const boltsEarned: BoltsEarnedData = {}
                const { data } = result
                let combinedBorrowBolts = 0
                let combinedDepositBolts = 0
                data.fuul.user.conversions.forEach((conversion: Conversion) => {
                    if ([1, 2].includes(conversion.conversion_id))
                        combinedBorrowBolts += parseInt(conversion.total_amount)
                    else if ([3, 4].includes(conversion.conversion_id))
                        combinedDepositBolts += parseInt(conversion.total_amount)
                    else boltsEarned[conversion.conversion_id] = parseInt(conversion.total_amount).toLocaleString()
                })
                boltsEarned[1] = combinedBorrowBolts.toLocaleString()
                boltsEarned[3] = combinedDepositBolts.toLocaleString()

                if (data.OgNFT) boltsEarned['OgNFT'] = 'Yes'
                if (data.OgNFV) boltsEarned['OgNFV'] = 'Yes'
                if (data.GenesisNFT) boltsEarned['GenesisNFT'] = 'Yes'
                setBoltsEarnedData(boltsEarned)
            }
        } catch (err) {
            console.error('Error fetching bolts earned data:', err)
        }
    }

    return (
        <Container>
            <Title>Bolts 🔩</Title>
            <SubHeader>Welcome Vault Keepers!</SubHeader>
            <Text>
                <p>
                    Complete the quests below to earn Bolts. Deposits, borrows, and LPs are awarded Bolts based on their
                    equivalent value in ETH.
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
                    <BoltsDetailsRow>EARNED: {userFuulData.points}</BoltsDetailsRow>
                    <BoltsDetailsRow>RANK: {userFuulData.rank}</BoltsDetailsRow>
                </BoltsDetails>
            </Section>
            <Section>
                <SectionHeader>Quests</SectionHeader>
                {QUESTS(boltsEarnedData).map((quest, index) => (
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

const Text = styled.div`
    background-color: rgba(202, 234, 255, 0.3);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0);
    border-radius: 4px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    font-size: ${(props) => props.theme.font.default};
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
