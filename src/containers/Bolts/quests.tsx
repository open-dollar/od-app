import Button from '~/components/Button'
import { ExternalLink } from 'react-feather'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { formatWithCommas, getTokenLogo } from '~/utils'
import Camelot from '~/components/Icons/Camelot'
import Affiliate from './Affiliate'
// import GalxeLogo from '~/assets/galxe.svg'
// import ZealyLogo from '~/assets/zealy.svg'

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
        <Camelot /> CAMELOT
    </LogoText>
)

const BtnStyle = css`
    color: black;
    transition: all 0.3s ease;
    padding: 10px 10px;
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 14px;
    justify-content: center;
    font-weight: 700;
    height: 100%;
    display: flex;
    align-items: center;
    &:hover {
        color: ${(props: any) => props.theme.colors.blueish};
    }

    svg {
        display: none;
        &.fill {
            fill: ${(props: any) => props.theme.colors.secondary};
            color: ${(props: any) => props.theme.colors.secondary};
        }
        &.opacity {
            opacity: 0.5;
        }
        ${({ theme }) => theme.mediaWidth.upToSmall`
   width: 18px;
         height: 18px;
         display: inline !important;
         margin-right:10px;
         color: ${(props: any) => props.theme.colors.neutral}
        `}
    }

    &:last-child {
        margin-right: 0;
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
      flex: 0 0 100%;
      min-width: 100%;
      font-weight: normal;
      padding: 15px 25px;
      display: flex;
      align-items:center;
      text-align: left;
      margin: 0;
      color :${(props: any) => props.theme.colors.primary};
    
  `}
`

const LinkIcon = styled(ExternalLink)`
    margin-left: 10px;
    width: 20px;
    height: 20px;
`

const NavButton = styled(NavLink)`
    ${BtnStyle}
    &.activeLink {
        display: flex;
        align-items: center;
        padding: 10px 10px;
        padding-left: 20px;
        padding-right: 20px;
        height: 100%;
        font-weight: 700;
        border-bottom: 5px solid ${(props: any) => props.theme.colors.secondary};
        background: ${(props: any) => props.theme.colors.primary};
        color: ${(props: any) => props.theme.colors.neutral};
        &:before {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 0;
            width: 100%;
            height: 3px;
            border-radius: 2px;
        }
        ${({ theme }) => theme.mediaWidth.upToSmall`
    
        border-bottom: none;
        
        &:before {
            display:none;
        }
        `}
    }
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

export const QUESTS = [
    {
        title: 'Refer Friends',
        text: 'Create your own affiliate link to share here by signing in with your wallet and entering a code. Invite friends with your referral link to earn 10% of their earned Bolts. They will receive a welcome bonus of 250 Bolts per ETH deposited for 30 days.',
        button: <Affiliate />,
        items: [
            {
                title: 'Source',
                status: (
                    <img src="/static/media/od-full-logo-light.a42429383b25790663d6e182b4f91a30.svg" alt="OD"></img>
                ),
            },
            { title: 'Bolts', status: '10% of referrals' },
        ],
    },
    {
        title: (
            <TitleContainer>
                <QuestTitle>Deposit</QuestTitle>
                <img src={getTokenLogo('WSTETH')} alt={'WSTETH'} width={'50px'} />
                <img src={getTokenLogo('RETH')} alt={'RETH'} width={'50px'} />
                <img src={getTokenLogo('ARB')} alt={'ARB'} width={'50px'} />
            </TitleContainer>
        ),
        buttonText: 'Go',
        button: <NavButton to="/vaults">Go</NavButton>,
        text: 'Deposit collateral to earn Bolts daily. Minimum 0.2 ETH equivalent.',
        items: [
            {
                title: 'Source',
                status: (
                    <img src="/static/media/od-full-logo-light.a42429383b25790663d6e182b4f91a30.svg" alt="OD"></img>
                ),
            },
            { title: 'Bolts', status: '500 per ETH' },
        ],
    },
    {
        title: (
            <TitleContainer>
                <QuestTitle>Borrow</QuestTitle>
                <img src={getTokenLogo('OD')} alt={'OD'} width={'50px'} />
            </TitleContainer>
        ),
        button: <NavButton to="/vaults">Go</NavButton>,
        text: 'Borrow OD from your NFV to earn Bolts daily.',
        items: [
            {
                title: 'Source',
                status: (
                    <img src="/static/media/od-full-logo-light.a42429383b25790663d6e182b4f91a30.svg" alt="OD"></img>
                ),
            },
            { title: 'Bolts', status: '1000 per ETH' },
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
            { title: 'Bolts', status: '3000 per ETH' },
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
            { title: 'Bolts', status: '2000 per ETH' },
        ],
    },
    {
        title: 'Social Tasks on Galxe',
        button: (
            <Button secondary onClick={() => onClick('https://galxe.com/opendollar')}>
                Go <LinkIcon />
            </Button>
        ),
        text: 'Complete tasks on Galxe to earn Bolts.',
        items: [
            { title: 'Source', status: '<GalxeLogo />' },
            { title: 'Bolts', status: 'Varies' },
        ],
    },
    {
        title: 'Social Tasks on Zealy',
        button: (
            <Button secondary onClick={() => onClick('https://zealy.io/c/opendollar/questboard')}>
                Go <LinkIcon />
            </Button>
        ),
        text: 'Complete tasks on Zealy to earn Bolts.',
        items: [
            { title: 'Source', status: 'Zealy' },
            { title: 'Bolts', status: 'Varies' },
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
                status: (
                    <img src="/static/media/od-full-logo-light.a42429383b25790663d6e182b4f91a30.svg" alt="OD"></img>
                ),
            },
            { title: 'Bolts', status: '+10% to deposit/borrow' },
        ],
    },
    {
        title: 'Community Goal - 20k ETH TVL',
        button: <NavButton to="/vaults">View TVL</NavButton>,
        text: `All existing point totals will receive a 30% bonus at the time of the snapshot when the Open Dollar TVL reaches 20k ETH.`,
        items: [
            {
                title: 'Source',
                status: (
                    <img src="/static/media/od-full-logo-light.a42429383b25790663d6e182b4f91a30.svg" alt="OD"></img>
                ),
            },
            { title: 'Bolts', status: '+30%' },
        ],
    },
]
