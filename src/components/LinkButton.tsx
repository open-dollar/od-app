import { ReactNode } from 'react'
import { ArrowRightCircle } from 'react-feather'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { BtnStyle } from '../GlobalStyle'

interface Props {
    url: string
    id?: string
    disabled?: boolean
    text?: string
    isExternal?: boolean
    withArrow?: boolean
    children?: ReactNode
    color?: 'blueish' | 'greenish' | 'yellowish' | 'colorPrimary' | 'colorSecondary'
    border?: boolean
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
    border,
    ...rest
}: Props) => {
    return isExternal ? (
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
const CustomLink = styled(Link)`
    ${BtnStyle}
    transition: opacity 0.3s ease;
    &:hover {
        opacity: 0.9;
    }
`
