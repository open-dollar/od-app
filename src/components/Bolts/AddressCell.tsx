import React, { useMemo } from 'react'
import { useAddress } from '~/hooks/useAddress'
import { returnWalletAddress } from '~/utils'
import Skeleton from 'react-loading-skeleton'
import { LeaderboardUser } from '~/model/boltsModel'
import styled from 'styled-components'

interface AddressCellProps {
    address: string
    userFuulDataAddress: string
    data: LeaderboardUser[]
}

const AddressCell: React.FC<AddressCellProps> = ({ address, userFuulDataAddress, data }) => {
    const userInTop10 = useMemo(() => data.find((user) => user.rank <= 10 && user.address === address), [data, address])
    // Skip ENS check for users not in the top 10
    const resolvedAddress = useAddress(address, 0, !userInTop10)

    return (
        <Address>
            {userFuulDataAddress === address && (
                <Badge
                    style={{
                        backgroundColor: '#e2f1ff',
                        color: '#1a74ec',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        marginRight: '8px',
                        fontWeight: 700,
                        fontSize: '12px',
                    }}
                >
                    YOU
                </Badge>
            )}
            {typeof resolvedAddress === 'string' && resolvedAddress.startsWith('0x')
                ? returnWalletAddress(address, 2)
                : resolvedAddress || <Skeleton width={100} />}
        </Address>
    )
}

export default React.memo(AddressCell, (prevProps, nextProps) => {
    return (
        prevProps.address === nextProps.address &&
        prevProps.userFuulDataAddress === nextProps.userFuulDataAddress &&
        prevProps.data === nextProps.data
    )
})

const Address = styled.span`
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    font-size: ${(props: any) => props.theme.font.xSmall};
    line-height: 21.79px;
    letter-spacing: 0.05em;
`

const Badge = styled.span`
    background-color: #e2f1ff;
    color: #1a74ec;
    padding: 2px 8px;
    border-radius: 4px;
    margin-right: 8px;
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    font-size: 12px;
`
