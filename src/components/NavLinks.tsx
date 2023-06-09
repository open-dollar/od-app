import React from 'react'
import { DollarSign, Repeat, Shield } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { NETWORK_ID } from '../connectors'
import useSwap from '../hooks/useSwap'
import { useStoreActions } from '../store'
import { SHOW_AUCTIONS } from '../utils/constants'
import { timeout } from '../utils/helper'
import AnalyticsIcon from './Icons/AnalyticsIcon'
import AuctionIcon from './Icons/AuctionIcon'
import SafeIcon from './Icons/SafeIcon'
import { useHistory } from 'react-router-dom'

const NavLinks = () => {
    const history = useHistory()
    const { location } = history

    const { t } = useTranslation()
    const { popupsModel: popupsActions } = useStoreActions((state) => state)
    const { generateSwap } = useSwap()
    const handleLinkClick = async (
        e: React.MouseEvent<HTMLElement>,
        disable = false,
        externalLink = '',
        isSwap = false
    ) => {
        if (disable) {
            e.preventDefault()
        }
        popupsActions.setShowSideMenu(false)
        if (externalLink) {
            window.open(externalLink, '_blank')
            e.preventDefault()
        }

        if (isSwap) {
            popupsActions.setIsWaitingModalOpen(true)
            popupsActions.setWaitingPayload({
                title: 'Please hold...',
                text: 'Preparing to swap',
                status: 'loading',
            })
            const url = await generateSwap()
            await timeout(1000)
            if (url) {
                popupsActions.setWaitingPayload({
                    title: 'Cheers!',
                    text: 'You can now swap dirty fiat to RAI!',
                    status: 'success',
                })
                await timeout(1000)
                window.open(url, '_blank')
                e.persist()
            } else {
                popupsActions.setWaitingPayload({
                    title: 'FAILED!',
                    text: 'Something went wrong generating swap url.',
                    status: 'error',
                })
            }
        }
    }

    return (
        <Nav>
            <NavBarLink
                id="app-link"
                to="/"
                onClick={(e) => handleLinkClick(e, false)}
                className={
                    location.pathname === '/' ||
                    location.pathname.startsWith('/safes')
                        ? 'activeLink'
                        : ''
                }
            >
                <SafeIcon className="opacity fill" /> {t('app')}
            </NavBarLink>
            {SHOW_AUCTIONS && SHOW_AUCTIONS !== '1' ? null : (
                <NavBarLink
                    to="/auctions"
                    onClick={(e) => handleLinkClick(e, false)}
                    className={
                        location.pathname === '/auctions' ? 'activeLink' : ''
                    }
                >
                    <AuctionIcon className="opacity fill" /> {t('auctions')}
                </NavBarLink>
            )}

            <Box className="has-menu">
                <LinkItem
                    className={
                        location.pathname.startsWith('/earn')
                            ? 'activeLink'
                            : ''
                    }
                >
                    <DollarSign /> {t('earn')}
                </LinkItem>
                <MenuBox className="menu-box">
                    <IntLink
                        to="/earn/staking"
                        onClick={() => popupsActions.setShowSideMenu(false)}
                    >
                        Staking{' '}
                        <img
                            src={require('../assets/dark-arrow.svg').default}
                            alt="arrow"
                        />
                    </IntLink>
                    {/* <IntLink
                        to="/earn/moneygod"
                        onClick={() => popupsActions.setShowSideMenu(false)}
                    >
                        Money God League{' '}
                        <img
                            src={require('../assets/dark-arrow.svg').default}
                            alt="arrow"
                        />
                    </IntLink> */}
                    <IntLink
                        to="/earn/incentives"
                        onClick={() => popupsActions.setShowSideMenu(false)}
                    >
                        Incentives{' '}
                        <img
                            src={require('../assets/dark-arrow.svg').default}
                            alt="arrow"
                        />
                    </IntLink>
                </MenuBox>
            </Box>
            <NavExtLink onClick={(e) => handleLinkClick(e, false, '', true)}>
                <Repeat /> {t('swap')}
            </NavExtLink>
            <Box className="has-menu">
                <LinkItem>
                    <Shield /> {t('insurance')}
                </LinkItem>
                <MenuBox className="menu-box">
                    <ExtLink
                        href="https://app.nexusmutual.io/cover/buy/get-quote?address=0xCC88a9d330da1133Df3A7bD823B95e52511A6962"
                        target="_blank"
                    >
                        Nexus Mutual{' '}
                        <img
                            src={require('../assets/dark-arrow.svg').default}
                            alt="arrow"
                        />
                    </ExtLink>
                    <ExtLink
                        href="https://app.insurace.io/Insurance/BuyCovers?referrer=1429350351089631541390481795260252294441502731750"
                        target="_blank"
                    >
                        InsurAce{' '}
                        <img
                            src={require('../assets/dark-arrow.svg').default}
                            alt="arrow"
                        />
                    </ExtLink>
                </MenuBox>
            </Box>
            <NavExtLink
                onClick={(e) =>
                    handleLinkClick(
                        e,
                        false,
                        NETWORK_ID === 1
                            ? 'https://stats.reflexer.finance/'
                            : 'https://stats-kovan.reflexer.finance/'
                    )
                }
            >
                <AnalyticsIcon className="fill" /> {t('analytics')}
            </NavExtLink>
        </Nav>
    )
}

export default NavLinks

const Nav = styled.div`
    display: flex;
    align-items: center;

    ${({ theme }) => theme.mediaWidth.upToSmall`
  
    flex-direction: column;
    
  `}
`

const BtnStyle = css`
    color: ${(props) => props.theme.colors.secondary};
    transition: all 0.3s ease;

    &:hover {
        color: ${(props) => props.theme.colors.blueish};
    }

    svg {
        display: none;
        &.fill {
            fill: ${(props) => props.theme.colors.secondary};
            color: ${(props) => props.theme.colors.secondary};
        }
        &.opacity {
            opacity: 0.5;
        }
        ${({ theme }) => theme.mediaWidth.upToSmall`
   width: 18px;
         height: 18px;
         display: inline !important;
         margin-right:10px;
         color: ${(props) => props.theme.colors.neutral}
        `}
    }

    margin-right: 20px;
    &:last-child {
        margin-right: 0;
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  &:first-child {
    border-top: 1px solid ${(props) => props.theme.colors.border};
  }
      flex: 0 0 100%;
      min-width: 100%;
      font-weight: normal;
      padding: 15px 25px;
      display: flex;
      align-items:center;
      text-align: left;
      margin: 0;
      color :${(props) => props.theme.colors.primary};
    
  `}
`
const NavExtLink = styled.a`
    ${BtnStyle}
    cursor: pointer;
`
const NavBarLink = styled(NavLink)`
    ${BtnStyle}
    position: relative;
    &.activeLink {
        color: ${(props) => props.theme.colors.neutral};
        &:before {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 0;
            width: 100%;
            height: 3px;
            border-radius: 2px;
            background: ${(props) => props.theme.colors.blueish};
        }
        ${({ theme }) => theme.mediaWidth.upToSmall`
        &:before {
            display:none;
        }
        `}
    }
`

const Box = styled.div`
    position: relative;
    cursor: pointer;
    &:hover {
        .menu-box {
            display: block;
        }
    }

    svg {
        display: none;
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
      border-bottom: 1px solid ${(props) => props.theme.colors.border};
      flex: 0 0 100%;
      min-width: 100%;
      font-weight: normal;
      padding: 15px 25px;
      svg {
        width: 18px;
         height: 18px;
         display: inline !important;
         margin-right:10px;
         color: ${(props) => props.theme.colors.secondary}
    }
    `}
`

const LinkItem = styled.div`
    color: ${(props) => props.theme.colors.secondary};
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 5px 0;
    margin-right: 20px;
    &.activeLink {
        color: ${(props) => props.theme.colors.neutral};
        &:before {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 0;
            width: calc(100% - 20px);
            height: 3px;
            border-radius: 2px;
            background: ${(props) => props.theme.colors.blueish};
        }
        ${({ theme }) => theme.mediaWidth.upToSmall`
        &:before {
            display:none;
        }
        `}
    }

    &:hover {
        color: ${(props) => props.theme.colors.blueish};
        svg {
            color: ${(props) => props.theme.colors.customSecondary};
        }
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
        font-weight:normal;
    `}
`

const MenuBox = styled.div`
    display: none;
    position: absolute;
    top: 30px;
    border-radius: 4px;
    background: ${(props) => props.theme.colors.foreground};
    z-index: 4;
    padding: 20px;
    min-width: 200px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.06);
    ${({ theme }) => theme.mediaWidth.upToSmall`
  display:block;
  position:static;
  box-shadow:none;
  padding:0;
  margin-bottom:20px;
  background: ${(props) => props.theme.colors.background};
  `}
`

const ExtLink = styled.a`
    color: ${(props) => props.theme.colors.secondary};
    font-size: 15px;
    line-height: 24px;
    letter-spacing: -0.18px;
    transition: all 0.3s ease;
    display: block;
    margin: 5px 0;
    cursor: pointer;
    &:last-child {
        margin-bottom: 0;
    }

    &:hover {
        text-decoration: none;
        transform: translateX(5px);
        color: ${(props) => props.theme.colors.neutral};
    }

    img {
        display: none;
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
        color: ${(props) => props.theme.colors.neutral};
        transform: translateX(0px) !important;
        img {
            display:inline;
            transform:rotate(180deg);
            margin-left:5px;
        }

    `}
`

const IntLink = styled(NavLink)`
    color: ${(props) => props.theme.colors.secondary};
    font-size: 15px;
    line-height: 24px;
    letter-spacing: -0.18px;
    transition: all 0.3s ease;
    display: block;
    margin: 5px 0;
    cursor: pointer;
    &:last-child {
        margin-bottom: 0;
    }

    &:hover {
        text-decoration: none;
        transform: translateX(5px);
        color: ${(props) => props.theme.colors.neutral};
    }

    img {
        display: none;
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
        color: ${(props) => props.theme.colors.customSecondary};
        transform: translateX(0px) !important;
        img {
            display:inline;
            transform:rotate(180deg);
            margin-left:5px;
        }

    `}
`
