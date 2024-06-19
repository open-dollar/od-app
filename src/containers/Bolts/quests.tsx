import Button from '~/components/Button'
import { ExternalLink } from 'react-feather'
import styled from 'styled-components'
import Affiliate from './Affiliate'
import zealyLogo from '~/assets/zealy.svg'
import galxeLogo from '~/assets/galxe.svg'
import camelotLogo from '~/assets/camelot.svg'
import odLogo from '~/assets/od-full-logo-light.svg'
import { useHistory } from 'react-router-dom'
import TokenIcon from '~/components/TokenIcon'

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
        <img alt="Galxe" src={galxeLogo} style={{ height: '16px' }} />
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
    display: inline;
    align-items: center;

    img {
        display: inline;
        vertical-align: sub;
    }
`

const QuestTitle = styled.div`
    display: inline;
    align-items: center;

    font-size: 26px;
    font-family: ${(props) => props.theme.family.headers};
    color: ${(props) => props.theme.colors.accent};
    font-weight: 700;

    margin-right: 10px;

    span {
        font-weight: 500;
        color: ${(props) => props.theme.colors.primary};
    }
`

const TokensGroup = styled.span`
    display: inline;
    flex-wrap: nowrap;
    align-items: center;
    white-space: nowrap;
    img:not(:first-child) {
        margin-left: -10px;
    }
    flex-shrink: 0;
`

const InternalLinkButton = ({ url }: { url: string }) => {
    const history = useHistory()
    const onClick = () => history.push(url)

    return (
        <Button secondary onClick={onClick}>
            Go
        </Button>
    )
}

const onClick = (url: string) => {
    window.open(url, '_blank')
}

export type BoltsEarnedData = {
    [key: string]: string
}

export const MULTIPLIERS = (boltsEarnedData: BoltsEarnedData) => [
    {
        title: 'Invite a Friend',
        text: (
            <>
                Create a referral link by signing a message with your wallet.
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
                status: '10% of referrals + friends receive 250 Bolts per ETH deposited for 30 days',
            },
            {
                title: 'Earned',
                status: boltsEarnedData['Invite a Friend'] || '-',
            },
        ],
    },
    {
        title: 'Genesis NFV User',
        button: (
            <Button secondary onClick={() => onClick('https://www.opendollar.com/blog/open-dollar-launches-mainnet')}>
                Learn more <LinkIcon />
            </Button>
        ),
        text: `Depositors using a Genesis NFV receive a 10% bonus for all deposit and borrow points earned with that vault.`,
        items: [
            {
                title: 'Source',
                status: <OpenDollarLogo />,
            },
            { title: 'Bolts', status: '+10% to deposit/borrow' },
            { title: 'Holder', status: boltsEarnedData['OgNFV'] || '-' },
        ],
    },
    {
        title: 'ODOG NFT Holder',
        button: (
            <Button
                secondary
                onClick={() =>
                    onClick(
                        'https://www.opendollar.com/blog/open-dollars-first-airdrop-and-call-for-delegates#:~:text=invitation%20to%20them.-,%E2%80%9COD%20OG%E2%80%9D%20NFTs,-To%20commemorate%20this'
                    )
                }
            >
                Get yours <LinkIcon />
            </Button>
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
            { title: 'Holder', status: boltsEarnedData['OgNFT'] || '-' },
        ],
    },
    {
        title: 'Genesis NFT Holder',
        button: (
            <Button
                secondary
                onClick={() =>
                    onClick(
                        'https://www.opendollar.com/blog/open-dollar-launches-mainnet#:~:text=Commemorative%20Launch%20Day%20NFT'
                    )
                }
            >
                Learn more <LinkIcon />
            </Button>
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
            { title: 'Holder', status: boltsEarnedData['GenesisNFT'] || '-' },
        ],
    },
    {
        title: 'Community Goal: 20K ETH TVL',
        button: '',
        text: `Existing Bolts receive a 30% bonus when TVL reaches 20,000 ETH.`,
        items: [
            {
                title: 'Source',
                status: <OpenDollarLogo />,
            },
            { title: 'Bolts', status: '+30%' },
            { title: 'Earned', status: boltsEarnedData['Community Goal: 20K ETH TVL'] || '-' },
        ],
    },
]

export const QUESTS = (boltsEarnedData: BoltsEarnedData) => [
    {
        title: (
            <TitleContainer>
                <QuestTitle>Deposit Collateral</QuestTitle>
                <TokensGroup>
                    <TokenIcon token={'WSTETH'} width={'34'} />
                    <TokenIcon token={'RETH'} width={'34'} />
                    <TokenIcon token={'ARB'} width={'34'} />
                </TokensGroup>
            </TitleContainer>
        ),
        button: <InternalLinkButton url="/vaults" />,
        text: 'Deposit collateral to earn Bolts daily. Genesis NFV users receive a 10% bonus.',
        items: [
            {
                title: 'Source',
                status: <OpenDollarLogo />,
            },
            { title: 'Bolts', status: '500 per ETH' },
            { title: 'Earned', status: boltsEarnedData[3] || '-' },
        ],
    },
    {
        title: (
            <TitleContainer>
                <QuestTitle>Borrow OD</QuestTitle>
                <TokensGroup>
                    <TokenIcon token={'OD'} width={'34'} />
                </TokensGroup>
            </TitleContainer>
        ),
        button: <InternalLinkButton url="/vaults" />,
        text: 'Borrow OD from your NFV to earn Bolts daily. Genesis NFV users receive a 10% bonus.',
        items: [
            {
                title: 'Source',
                status: <OpenDollarLogo />,
            },
            { title: 'Bolts', status: '1,000 per ETH' },
            { title: 'Earned', status: boltsEarnedData[1] || '-' },
        ],
    },
    {
        title: (
            <TitleContainer>
                <QuestTitle>Provide Liquidity ODG-ETH</QuestTitle>
                <TokensGroup>
                    <TokenIcon token={'ODG'} width={'34'} />
                    <TokenIcon token={'WETH'} width={'34'} />
                </TokensGroup>
            </TitleContainer>
        ),
        button: (
            <Button
                secondary
                onClick={() =>
                    onClick('https://info.camelot.exchange/pair/v3/0xf935263c9950eb2881ff58bd6a76c3d2564a78d5')
                }
            >
                Go <LinkIcon />
            </Button>
        ),
        text: 'Provide liquidity to the ODG/ETH pair on Camelot to earn Bolts daily.',
        items: [
            { title: 'Source', status: <CamelotLogo /> },
            { title: 'Bolts', status: '2,000 per ETH' },
            { title: 'Earned', status: boltsEarnedData[8] || '-' },
        ],
    },
    {
        title: (
            <TitleContainer>
                <QuestTitle>Provide Liquidity OD-ETH</QuestTitle>
                <TokensGroup>
                    <TokenIcon token={'OD'} width={'34'} />
                    <TokenIcon token={'WETH'} width={'34'} />
                </TokensGroup>
            </TitleContainer>
        ),
        button: (
            <Button
                secondary
                onClick={() =>
                    onClick('https://info.camelot.exchange/pair/v3/0x824959a55907d5350e73e151ff48dabc5a37a657')
                }
            >
                Go <LinkIcon />
            </Button>
        ),
        text: 'Provide liquidity to the OD/ETH pair on Camelot to earn Bolts daily.',
        items: [
            { title: 'Source', status: <CamelotLogo /> },
            { title: 'Bolts', status: '3,000 per ETH' },
            { title: 'Earned', status: boltsEarnedData[7] || '-' },
        ],
    },
    {
        title: 'Galxe and Zealy',
        button: (
            <>
                <Button secondary onClick={() => onClick('https://galxe.com/opendollar')}>
                    Galxe <LinkIcon />
                </Button>
                <Button secondary onClick={() => onClick('https://zealy.io/c/opendollar/questboard')}>
                    Zealy <LinkIcon />
                </Button>
            </>
        ),
        text: 'Complete tasks on Galxe and Zealy to earn Bolts.',
        items: [
            {
                title: 'Source',
                status: (
                    <>
                        <GalxeLogo />
                        <ZealyLogo />
                    </>
                ),
            },
            { title: 'Bolts', status: 'Varies' },
            { title: 'Earned', status: boltsEarnedData[6] || '-' },
        ],
    },
]
