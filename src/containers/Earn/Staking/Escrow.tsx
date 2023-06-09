import dayjs from 'dayjs'
import React, { useState } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import {
    useClaimEscrowedTokens,
    useStakingInfo,
} from '../../../hooks/useStaking'
import { formatNumber } from '../../../utils/helper'

const Escrow = () => {
    const { escrowData } = useStakingInfo()
    const [isPending, setIsPending] = useState(false)
    const { claimEscrowedTokensCallback } = useClaimEscrowedTokens()

    const date =
        escrowData && escrowData.vestingEndDate > 0
            ? dayjs.unix(escrowData.vestingEndDate).format('MMM D, YYYY')
            : 'N/A'

    const tokens =
        escrowData && Number(escrowData.claimableTokens) > 0
            ? Number(escrowData.claimableTokens) > 0.0001
                ? formatNumber(escrowData.claimableTokens)
                : '< 0.0001'
            : '0'

    const total =
        escrowData && Number(escrowData.totalVested) > 0
            ? Number(escrowData.totalVested) > 0.0001
                ? formatNumber(escrowData.totalVested)
                : '< 0.0001'
            : '0'

    const handleClaim = async () => {
        try {
            setIsPending(true)
            await claimEscrowedTokensCallback()
            setIsPending(false)
        } catch (error) {
            console.log(error)
            setIsPending(false)
        }
    }

    return (
        <>
            <Body>
                <Box>
                    <Label>Amount to Unlock</Label>
                    <Value>
                        {total}{' '}
                        <img
                            src={
                                require('../../../assets/flx-logo.svg').default
                            }
                            alt=""
                        />
                    </Value>
                </Box>

                <Box>
                    <Label>Unlocking End Date</Label>
                    <Value>{date}</Value>
                </Box>

                <Box>
                    <Label>Claimable from Escrow</Label>
                    <Value>
                        {tokens}{' '}
                        <img
                            src={
                                require('../../../assets/flx-logo.svg').default
                            }
                            alt=""
                        />
                    </Value>
                </Box>

                <BtnContainer>
                    <Button
                        text="Withdraw from Escrow"
                        disabled={
                            Number(escrowData.claimableTokens) <= 0 || isPending
                        }
                        onClick={handleClaim}
                    />
                </BtnContainer>
            </Body>
        </>
    )
}

export default Escrow

const Body = styled.div`
    padding: 25px 30px;
`

const Box = styled.div`
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid ${(props) => props.theme.colors.border};
    background: ${(props) => props.theme.colors.foreground};
    border-radius: 4px;
    font-size: 14px;
    &:nth-child(2) {
        margin: 15px 0;
    }
`

const Label = styled.div`
    color: ${(props) => props.theme.colors.secondary};
    font-weight: bold;
`
const Value = styled.div`
    display: flex;
    align-items: center;
    img {
        margin-left: 5px;
        width: 20px;
        height: 20px;
    }
`

const BtnContainer = styled.div`
    margin-top: 20px;
    button {
        width: 100%;
    }
`
