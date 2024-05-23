import Button from '~/components/Button'
import { ExternalLink } from 'react-feather'
import styled from 'styled-components'
import { getTokenLogo } from '~/utils'
import Affiliate from './Affiliate'
import zealyLogo from '~/assets/zealy.svg'
import galxeLogo from '~/assets/galxe.svg'
import camelotLogo from '~/assets/camelot.svg'
import odLogo from '~/assets/od-full-logo-light.svg'

const onClick = (url: string) => {
    window.open(url, '_blank')
}

const StyledAnchor = styled.a`
    padding: 5px 5px;
    color: ${(props) => props.theme.colors.primary};
`

const LogoText = styled.p`
    letter-spacing: 2px;
    display: flex;
    align-items: center;
`

const CamelotLogo = () => (
    <LogoText>
        <img alt="Camelot" src={camelotLogo} style={{ height: '27px' }} />
    </LogoText>
)

const ZealyLogo = () => (
    <LogoText>
        <img alt="Zealy" src={zealyLogo} style={{ marginRight: '8px' }} />
        ZEALY
    </LogoText>
)

const GalxeLogo = () => (
    <LogoText>
        <img alt="Galxe" src={galxeLogo} style={{ height: '17px' }} />
    </LogoText>
)

const OpenDollarLogo = () => (
    <LogoText>
        <img alt="Open Dollar" src={odLogo} style={{ height: '27px' }}></img>
    </LogoText>
)

const LinkIcon = styled(ExternalLink)`
    margin-left: 10px;
    width: 20px;
    height: 20px;
`

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
`

const QuestTitle = styled.div`
    display: flex;
    align-items: center;

    font-size: ${(props) => props.theme.font.large};
    font-family: ${(props) => props.theme.family.headers};
    color: ${(props) => props.theme.colors.accent};
    font-weight: 700;

    margin-right: 22px;

    span {
        font-weight: 500;
        color: ${(props) => props.theme.colors.primary};
    }
`

const CtaButton = styled(Button)`
    max-height: 42px;
`

export const QUESTS = [
    {
        title: 'Invite a Friend',
        text: (
            <>
                Create an affiliate link by signing a message with your wallet.
                <Affiliate />
            </>
        ),
        button: '',
        items: [
            {
                title: 'Source',
                status: <OpenDollarLogo />,
            },
            {
                title: 'Bolts',
                status: '10% of referrals + Friends receive 250 Bolts per ETH deposited for 30 days',
            },
        ],
    },
    {
        title: (
            <TitleContainer>
                <QuestTitle>Deposit Collateral</QuestTitle>
                <img src={getTokenLogo('WSTETH')} alt={'WSTETH'} width={'50px'} />
                <img src={getTokenLogo('RETH')} alt={'RETH'} width={'50px'} />
                <img src={getTokenLogo('ARB')} alt={'ARB'} width={'50px'} />
            </TitleContainer>
        ),
        button: '',
        text: 'Deposit collateral to earn Bolts daily. Minimum 0.2 ETH equivalent.',
        items: [
            {
                title: 'Source',
                status: <OpenDollarLogo />,
            },
            { title: 'Bolts', status: '500 per ETH' },
        ],
    },
    {
        title: (
            <TitleContainer>
                <QuestTitle>Borrow OD</QuestTitle>
                <img src={getTokenLogo('OD')} alt={'OD'} height={'50px'} />
            </TitleContainer>
        ),
        button: '',
        text: 'Borrow OD from your NFV to earn Bolts daily.',
        items: [
            {
                title: 'Source',
                status: <OpenDollarLogo />,
            },
            { title: 'Bolts', status: '1,000 per ETH' },
        ],
    },
    {
        title: (
            <TitleContainer>
                <QuestTitle>Provide Liquidity ODG-ETH</QuestTitle>
                <img src={getTokenLogo('ODG')} alt={'ODG'} width={'50px'} />
                <img src={getTokenLogo('WETH')} alt={'WETH'} width={'50px'} />
            </TitleContainer>
        ),
        button: (
            <CtaButton
                secondary
                onClick={() =>
                    onClick('https://info.camelot.exchange/pair/v3/0xf935263c9950eb2881ff58bd6a76c3d2564a78d5')
                }
            >
                Go <LinkIcon />
            </CtaButton>
        ),
        text: 'Provide liquidity to the ODG/ETH pair on Camelot to earn Bolts daily.',
        items: [
            { title: 'Source', status: <CamelotLogo /> },
            { title: 'Bolts', status: '2,000 per ETH' },
        ],
    },
    {
        title: (
            <TitleContainer>
                <QuestTitle>Provide Liquidity OD-ETH</QuestTitle>
                <img src={getTokenLogo('OD')} alt={'OD'} width={'50px'} />
                <img src={getTokenLogo('WETH')} alt={'WETH'} width={'50px'} />
            </TitleContainer>
        ),
        button: (
            <CtaButton
                secondary
                onClick={() =>
                    onClick('https://info.camelot.exchange/pair/v3/0x824959a55907d5350e73e151ff48dabc5a37a657')
                }
            >
                Go <LinkIcon />
            </CtaButton>
        ),
        text: 'Provide liquidity to the OD/ETH pair on Camelot to earn Bolts daily.',
        items: [
            { title: 'Source', status: <CamelotLogo /> },
            { title: 'Bolts', status: '3,000 per ETH' },
        ],
    },
    {
        title: 'Social Tasks on Galxe',
        button: (
            <CtaButton secondary onClick={() => onClick('https://galxe.com/opendollar')}>
                Go <LinkIcon />
            </CtaButton>
        ),
        text: 'Complete tasks on Galxe to earn Bolts.',
        items: [
            { title: 'Source', status: <GalxeLogo /> },
            { title: 'Bolts', status: 'Varies' },
        ],
    },
    {
        title: 'Social Tasks on Zealy',
        button: (
            <CtaButton secondary onClick={() => onClick('https://zealy.io/c/opendollar/questboard')}>
                Go <LinkIcon />
            </CtaButton>
        ),
        text: 'Complete tasks on Zealy to earn Bolts.',
        items: [
            { title: 'Source', status: <ZealyLogo /> },
            { title: 'Bolts', status: 'Varies' },
        ],
    },
    {
        title: 'ODOG NFT Holder',
        button: (
            <CtaButton
                secondary
                onClick={() =>
                    onClick(
                        'https://www.opendollar.com/blog/open-dollars-first-airdrop-and-call-for-delegates#:~:text=invitation%20to%20them.-,%E2%80%9COD%20OG%E2%80%9D%20NFTs,-To%20commemorate%20this'
                    )
                }
            >
                Get yours <LinkIcon />
            </CtaButton>
        ),
        text: (
            <div>
                Holders of the
                <StyledAnchor
                    href="https://polygonscan.com/token/0x346324e797c8fa534b10fc9127ccfd9cb9e9aab7"
                    target="_blank"
                >
                    ODOG NFT
                </StyledAnchor>
                receive a 3% bonus for all points earned.
            </div>
        ),

        items: [
            { title: 'Source', status: 'Guild.xyz' },
            { title: 'Bolts', status: '+3% to all points' },
        ],
    },
    {
        title: 'Genesis NFT Holder',
        button: (
            <CtaButton
                secondary
                onClick={() =>
                    onClick(
                        'https://www.opendollar.com/blog/open-dollar-launches-mainnet#:~:text=Commemorative%20Launch%20Day%20NFT'
                    )
                }
            >
                Learn more <LinkIcon />
            </CtaButton>
        ),
        text: (
            <div>
                Holders of the
                <StyledAnchor
                    href="https://arbiscan.io/token/0x3D6d1f3cEeb33F8cF3906bb716360ba25037beC8"
                    target="_blank"
                >
                    Genesis NFT
                </StyledAnchor>
                receive a 7% bonus for all points earned.
            </div>
        ),
        items: [
            { title: 'Source', status: 'NFTs2Me' },
            { title: 'Bolts', status: '+7% to all points' },
        ],
    },
    {
        title: 'Genesis NFV User',
        button: (
            <CtaButton
                secondary
                onClick={() => onClick('https://www.opendollar.com/blog/open-dollar-launches-mainnet')}
            >
                Learn more <LinkIcon />
            </CtaButton>
        ),
        text: `Depositors using a Genesis NFV receive a 10% bonus for all deposit and borrow points earned with that vault.`,
        items: [
            {
                title: 'Source',
                status: <OpenDollarLogo />,
            },
            { title: 'Bolts', status: '+10% to deposit/borrow' },
        ],
    },
    {
        title: 'Community Goal: 20k ETH TVL',
        button: '',
        text: `All existing point totals will receive a 30% bonus at the time of the snapshot when the Open Dollar TVL reaches 20,000 ETH.`,
        items: [
            {
                title: 'Source',
                status: <OpenDollarLogo />,
            },
            { title: 'Bolts', status: '+30%' },
        ],
    },
]
