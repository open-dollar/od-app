import styled from 'styled-components'
import { ExternalLinkArrow } from '~/GlobalStyle'
import { getEtherscanLink } from '~/utils'
import { useAddress } from '~/hooks/useAddress'

export const Link = styled.a`
    ${ExternalLinkArrow}
`

interface AddressLinkProps {
    chainId: number
    address: string
}

export const AddressLink = ({ chainId, address }: AddressLinkProps) => {
    return (
        <Link href={getEtherscanLink(chainId, address, 'address')} target="_blank">
            {useAddress(address)}
        </Link>
    )
}
