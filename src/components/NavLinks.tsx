import React from 'react'
import styled, { css } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

import { useStoreActions } from '../store'
import SafeIcon from './Icons/SafeIcon'

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
                to="/safes"
                onClick={(e) => handleLinkClick(e, false)}
                className={location.pathname.startsWith('/safes') ? 'activeLink' : ''}
            >
                <SafeIcon className="opacity fill" /> {t('app')}
            </NavBarLink>
            <NavBarLink
                id="auction-link"
                to="/auctions"
                onClick={(e) => handleLinkClick(e, false)}
                className={location.pathname.startsWith('/auctions') ? 'activeLink' : ''}
            >
                <SafeIcon className="opacity fill" /> {t('auctions')}
            </NavBarLink>
            <NavBarLink
                id="analytics-link"
                to="/analytics"
                onClick={(e) => handleLinkClick(e, false)}
                className={location.pathname.startsWith('/analytics') ? 'activeLink' : ''}
            >
                <SafeIcon className="opacity fill" /> {t('analytics')}
            </NavBarLink>
        </Nav>
    )
}

export default NavLinks

const Nav = styled.div`
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
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
