import React from 'react'
import styled from 'styled-components'
import { ExternalLinkArrow } from '~/GlobalStyle'
import { getEtherscanLink, returnWalletAddress } from '~/utils'

interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement> { href: string, target: string}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}
export const Link = styled.a<LinkProps>`
    ${ExternalLinkArrow}
`

interface AddressLinkProps {
    chainId: number
    address: string
}

export const AddressLink = ({ chainId, address }: AddressLinkProps) => {
    return (
        <Link href={getEtherscanLink(chainId, address, 'address')} target="_blank">
            {returnWalletAddress(address)}
        </Link>
    )
}
