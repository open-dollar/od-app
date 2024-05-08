import { ReactNode } from 'react'
import { ArrowRightCircle } from 'react-feather'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { BtnStyle } from '../GlobalStyle'
import { css } from 'styled-components'

interface Props {
    url: string
    id?: string
    disabled?: boolean
    text?: string
    isExternal?: boolean
    withArrow?: boolean
    children?: ReactNode
    color?: 'blueish' | 'greenish' | 'yellowish' | 'colorPrimary' | 'colorSecondary'
    border?: string
}
const LinkButton = ({
    id,
    text,
    disabled,
    url,
    isExternal,
    withArrow,
    children,
    color = 'blueish',
    border = '',
    ...rest
}: Props) => {
    return isExternal ? (
        //@ts-ignore
        <ExtLink id={id} {...rest} href={url} target="_blank" rel="norefferer" disabled={disabled} color={color}>
            {children}
            <span>{text}</span> {withArrow ? <ArrowRightCircle size={'18'} /> : null}
        </ExtLink>
    ) : (
        <CustomLink id={id} {...rest} to={url} color={color} disabled={disabled} border={border}>
            {children}
            <span>{text}</span> {withArrow ? <ArrowRightCircle size={'18'} /> : null}
        </CustomLink>
    )
}

export default LinkButton

const ExtLink = styled.a`
    ${BtnStyle}
    transition: opacity 0.3s ease;
    &:hover {
        opacity: 0.9;
    }
`

const RedesignedBtnStyle = css<{
    disabled?: boolean
    color?: string
    border?: string
}>`
    pointer-events: ${({ theme, disabled }) => (disabled ? 'none' : 'inherit')};
    outline: none;
    cursor: ${({ theme, disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    min-width: 134px;
    border: ${({ theme, border }) => (border ? `1px solid ${theme.colors.blueish}` : 'none')};
    box-shadow: none;
    line-height: 24px;
    font-size: 18px;
    font-weight: 600;
    padding: 8px 30px;
    font-family: 'Barlow', sans-serif;
    color: ${({ theme, border }) => (border ? 'white' : '#1A74EC')};
    background: ${({ theme, disabled, color }) => (disabled ? 'rgb(71, 86, 98, 0.4)' : color)};
    border-radius: 4px 0px 0px 0px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const CustomLink = styled(Link)`
    ${RedesignedBtnStyle}
    transition: opacity 0.3s ease;
    &:hover {
        opacity: 0.9;
    }
`
