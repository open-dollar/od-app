import React from 'react'
import styled, { css } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

import { useStoreActions } from '../store'

const NavLinks = () => {
    const history = useHistory()
    const { location } = history

    const { t } = useTranslation()
    const { popupsModel: popupsActions } = useStoreActions((state) => state)
    const handleLinkClick = async (e: React.MouseEvent<HTMLElement>, disable = false, externalLink = '') => {
        if (disable) {
            e.preventDefault()
        }
        popupsActions.setShowSideMenu(false)
        if (externalLink) {
            window.open(externalLink, '_blank')
            e.preventDefault()
        }
    }

    return (
        <Nav>
            <NavBarLink
                id="app-link"
                to="/vaults"
                onClick={(e) => handleLinkClick(e, false)}
                className={location.pathname.startsWith('/vaults') || location.pathname === '/' ? 'activeLink' : ''}
            >
                {t('app')}
            </NavBarLink>
            <NavBarLink
                id="earn-link"
                to="/earn"
                onClick={(e) => handleLinkClick(e, false)}
                className={location.pathname.startsWith('/earn') ? 'activeLink' : ''}
            >
                {t('earn')}
            </NavBarLink>
            <NavBarLink
                id="auction-link"
                to="/auctions"
                onClick={(e) => handleLinkClick(e, false)}
                className={location.pathname.startsWith('/auctions') ? 'activeLink' : ''}
            >
                {t('auctions')}
            </NavBarLink>
            <NavBarLink
                id="stats-link"
                to="/stats"
                onClick={(e) => handleLinkClick(e, false)}
                className={location.pathname.startsWith('/stats') ? 'activeLink' : ''}
            >
                {t('stats')}
            </NavBarLink>
        </Nav>
    )
}

export default NavLinks

const Nav = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    @media (max-width: 767px) {
        position: unset;
        transform: initial;
        flex-direction: column;
    }
    ${({ theme }) => theme.mediaWidth.upToSmall``}
`

const BtnStyle = css`
    font-family: 'Barlow', sans-serif;
    color: black;
    transition: all 0.3s ease;
    padding: 10px 10px;
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
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
const NavBarLink = styled(NavLink)`
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
