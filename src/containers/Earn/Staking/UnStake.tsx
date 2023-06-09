import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ethers } from 'ethers'
import React, { useMemo, useState } from 'react'
import { Info } from 'react-feather'
import { useTranslation } from 'react-i18next'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import AlertLabel from '../../../components/AlertLabel'
import Button from '../../../components/Button'
import TokenInput from '../../../components/TokenInput'
import useGeb from '../../../hooks/useGeb'
import {
    useInputsHandlers,
    useRequestExit,
    useStakingInfo,
    useUnstake,
} from '../../../hooks/useStaking'
import {
    ApprovalState,
    useTokenApproval,
} from '../../../hooks/useTokenApproval'
import { TOKENS } from '../../../utils/tokens'
import { formatNumber } from '../../../utils/helper'

dayjs.extend(duration)
dayjs.extend(relativeTime)
const UnStake = () => {
    const { t } = useTranslation()
    const [isPending, setIsPending] = useState(false)
    const geb = useGeb()
    const {
        balances,
        parsedAmounts,
        error,
        hasPendingExitRequests,
        allowExit,
        exitRequests,
        exitDelay,
    } = useStakingInfo(false)
    const { onUnStakingInput } = useInputsHandlers()
    const { requestExitCallback } = useRequestExit()
    const { unStakeCallback } = useUnstake()

    const isValid = !error

    const exitReqestDeatline =
        exitRequests && exitRequests.deadline > 0
            ? dayjs.unix(exitRequests.deadline).format('MMM D, YYYY h:mm A')
            : null

    const totalUnlockedAmount = useMemo(() => {
        if (!hasPendingExitRequests || !parsedAmounts.stakingAmount)
            return parsedAmounts.stakingAmount

        const stakingAmountBN = ethers.utils.parseEther(
            parsedAmounts.stakingAmount
        )
        const existRequestsAmount = ethers.utils.parseEther(
            exitRequests.lockedAmount
        )
        return ethers.utils.formatEther(
            stakingAmountBN.add(existRequestsAmount)
        )
    }, [
        exitRequests.lockedAmount,
        hasPendingExitRequests,
        parsedAmounts.stakingAmount,
    ])

    const [unStakeApprovalState, approveUnStake] = useTokenApproval(
        totalUnlockedAmount,
        geb?.contracts.stakingToken.address,
        geb?.contracts.stakingFirstResort.address
    )

    const stFlxAmountValue = parsedAmounts.stFlxAmount
        ? Number(parsedAmounts.stFlxAmount) > 0 &&
          parsedAmounts.stFlxAmount.includes('.') &&
          parsedAmounts.stFlxAmount.split('.')[1].length > 5
            ? (formatNumber(parsedAmounts.stFlxAmount) as string)
            : parsedAmounts.stFlxAmount
        : ''

    const handleMaxInput = () => onUnStakingInput(balances.stFlxBalance)

    const handleRequestExit = async () => {
        try {
            await requestExitCallback()
            onUnStakingInput('')
        } catch (error) {
            console.log(error)
        }
    }

    const handleUnstake = async () => {
        try {
            setIsPending(true)
            await unStakeCallback()
            setIsPending(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Body>
                <SideLabel>Unstake FLX/ETH</SideLabel>
                <TokenInput
                    token={TOKENS.unstake}
                    label={`Balance: ${formatNumber(balances.stFlxBalance)} ${
                        TOKENS.unstake.name
                    }`}
                    rightLabel={``}
                    onChange={onUnStakingInput}
                    value={stFlxAmountValue}
                    handleMaxClick={handleMaxInput}
                />
            </Body>

            {hasPendingExitRequests && !allowExit ? (
                <AlertBox>
                    <AlertLabel
                        isBlock={false}
                        type="alert"
                        text={`You will be able to unstake approx ${formatNumber(
                            exitRequests.lockedAmount,
                            2
                        )} stFLX starting on ${exitReqestDeatline}`}
                    />
                </AlertBox>
            ) : null}

            {!hasPendingExitRequests && allowExit ? (
                <AlertBox>
                    <AlertLabel
                        type="success"
                        text={`You can now unstake ${formatNumber(
                            exitRequests.lockedAmount,
                            2
                        )} stFLX`}
                    />
                </AlertBox>
            ) : null}

            <Footer>
                <BtnContainer>
                    {isValid &&
                    (unStakeApprovalState === ApprovalState.PENDING ||
                        unStakeApprovalState === ApprovalState.NOT_APPROVED) ? (
                        <Button
                            style={{ width: '100%' }}
                            disabled={
                                !isValid ||
                                unStakeApprovalState === ApprovalState.PENDING
                            }
                            text={
                                unStakeApprovalState === ApprovalState.PENDING
                                    ? 'Pending Approval..'
                                    : 'Approve'
                            }
                            onClick={approveUnStake}
                        />
                    ) : (
                        <>
                            <UnstakeBtn
                                onMouseEnter={() => ReactTooltip.rebuild()}
                                style={{
                                    width:
                                        !hasPendingExitRequests && !allowExit
                                            ? '100%'
                                            : '48%',
                                }}
                            >
                                <Button
                                    style={{
                                        width: `100%`,
                                    }}
                                    disabled={!isValid}
                                    text={error ? error : 'Request Unstake'}
                                    onClick={handleRequestExit}
                                />

                                {hasPendingExitRequests || allowExit ? (
                                    <InfoIcon
                                        data-tip={t('unstake_request_pending', {
                                            exitDelay: exitDelay
                                                ? dayjs
                                                      .duration(
                                                          exitDelay,
                                                          'seconds'
                                                      )
                                                      .humanize()
                                                : '-',
                                        })}
                                    >
                                        <Info size="16" />
                                    </InfoIcon>
                                ) : null}
                            </UnstakeBtn>

                            {hasPendingExitRequests || allowExit ? (
                                <Button
                                    style={{
                                        width: '48%',
                                    }}
                                    disabled={
                                        (hasPendingExitRequests &&
                                            !allowExit) ||
                                        (!hasPendingExitRequests &&
                                            !allowExit) ||
                                        isPending
                                    }
                                    text={'Unstake'}
                                    onClick={handleUnstake}
                                />
                            ) : null}
                        </>
                    )}
                    <ReactTooltip multiline type="light" data-effect="solid" />
                </BtnContainer>
            </Footer>
        </>
    )
}

export default UnStake

const AlertBox = styled.div`
    padding: 0 20px;
    @media (min-width: 991px) {
        > div {
            padding: 8px 16% !important;
        }
    }
`
const SideLabel = styled.div`
    font-weight: 600;
    font-size: ${(props) => props.theme.font.default};
    margin-bottom: 10px;
`

const Body = styled.div`
    padding: 30px 20px 20px;
    > div > div {
        text-transform: inherit;
    }
`

const Footer = styled.div`
    padding: 20px;
`

const BtnContainer = styled.div`
    text-align: center;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const UnstakeBtn = styled.div`
    position: relative;
`

const InfoIcon = styled.div`
    position: absolute;
    top: 12px;
    right: 10px;
    cursor: pointer;
    svg {
        fill: ${(props) => props.theme.colors.warningBackground};
        color: ${(props) => props.theme.colors.warningColor};
    }
`
