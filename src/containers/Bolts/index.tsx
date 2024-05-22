import styled from 'styled-components'

import { useStoreState } from 'easy-peasy'
import { useStoreActions } from 'easy-peasy'
import { useActiveWeb3React } from '~/hooks'
import { useEffect } from 'react'
import useGeb from '~/hooks/useGeb'
import Loader from '~/components/Loader'
import Button from '~/components/Button'
import { ExternalLink } from 'react-feather'
import { POOLS } from '~/utils'
import Affiliate from './Affiliate'

const Bolts = () => {
    const geb = useGeb()
    const { account } = useActiveWeb3React()

    const handleClick = () => {
        window.open('https://discord.opendollar.com/', '_blank')
    }

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
            <BoltsDetails>
                <div>Your Bolts: 1,278</div>
                <div>Rank:</div>
            </BoltsDetails>
            <Section>
                <SectionHeader>Referral Link</SectionHeader>
                <Affiliate />
            </Section>
            <Section>
                <SectionHeader>Earn Bolts 🔩</SectionHeader>
            </Section>
            <BtnWrapper>
                <Button
                    data-test-id="steps-btn"
                    id={'suggest-pool-btn'}
                    // text={'suggest a new pool'}
                    secondary
                    onClick={handleClick}
                >
                    suggest a new program <ExternalLink />
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
    background-color: #475662;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    text-transform: uppercase;
    color: #fff;
    font-weight: 700;
    font-size: ${(props) => props.theme.font.default};
    border-radius: 3px;
    p {
        margin-bottom: 10px;
    }
    margin-bottom: 30px;
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
