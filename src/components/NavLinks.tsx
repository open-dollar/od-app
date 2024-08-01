import React from 'react'
import styled, { css } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'

import { useStoreActions } from '../store'

const NavLinks = () => {
    const location = useLocation()

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

    const links = [
        { name: 'app', to: '/vaults' },
        { name: 'earn', to: '/earn' },
        { name: 'auctions', to: '/auctions' },
        { name: 'bolts', to: '/bolts' },
        { name: 'stats', to: '/stats' },
    ]

    return (
        <Nav>
            {links.map((link) => {
                return (
                    <NavBarLink
                        key={`link-${link.name}`}
                        to={link.to}
                        id={`${link.name}-link`}
                        onClick={(e) => handleLinkClick(e, false)}
                        className={location.pathname.startsWith(link.to) ? 'activeLink' : ''}
                    >
                        {t(link.name)}
                    </NavBarLink>
                )
            })}
        </Nav>
    )
}

export default NavLinks

const Nav = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    @media (max-width: 1073px) {
        position: unset;
        transform: initial;
        flex-direction: column;
    }
`

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
         color: #ffffff
        `}
    }

    &:last-child {
        margin-right: 0;
    }

    @media (max-width: 1073px) {
        flex: 0 0 100%;
        min-width: 100%;
        font-weight: normal;
        padding: 15px 25px;
        display: flex;
        align-items: center;
        text-align: left;
        margin: 0;
        color: #1a74ec;
        font-size: 20px;
    }
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
        border-bottom: 5px solid ${(props) => props.theme.colors.secondary};
        background: ${(props) => props.theme.colors.primary};
        color: ${(props) => props.theme.colors.neutral};
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
