import React, { useCallback, useState } from 'react'
import { ArrowLeft, Link2, Shield } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import Button from '../../components/Button'
import LinkButton from '../../components/LinkButton'
import { useActiveWeb3React } from '../../hooks'
import { handleTransactionError } from '../../hooks/TransactionHooks'
import { useIsOwner } from '../../hooks/useGeb'
import { useSafeInfo } from '../../hooks/useSafe'
import {
    useHasLeftOver,
    useHasSaviour,
    useMinSaviourBalance,
    useSaviourGetReserves,
    useSaviourInfo,
} from '../../hooks/useSaviour'
import { useStoreActions, useStoreState } from '../../store'

const SafeHeader = ({
    safeId,
    isModifying,
    isDeposit,
}: {
    safeId: string
    isModifying: boolean
    isDeposit: boolean
}) => {
    const { t } = useTranslation()

    const [loading, setIsLoading] = useState(false)
    const { account, library } = useActiveWeb3React()
    const { totalDebt, totalCollateral } = useSafeInfo(
        isModifying
            ? isDeposit
                ? 'deposit_borrow'
                : 'repay_withdraw'
            : 'create'
    )

    const { saviourData } = useSaviourInfo()
    const { safeModel: safeState } = useStoreState((state) => state)

    const { popupsModel: popupsActions } = useStoreActions((state) => state)

    const { getMinSaviourBalance } = useMinSaviourBalance()

    const hasSaviour = useHasSaviour(
        safeState.singleSafe?.safeHandler as string
    )

    const leftOver = useHasLeftOver(safeState.singleSafe?.safeHandler as string)

    const { getReservesCallback } = useSaviourGetReserves()

    const history = useHistory()

    const isOwner = useIsOwner(safeId)

    const handleSaviourBtnClick = async (data: {
        status: boolean
        saviourAddress: string
    }) => {
        const { status, saviourAddress } = data
        if (status) {
            if (!library || !account) throw new Error('No library or account')
            setIsLoading(true)
            try {
                popupsActions.setIsWaitingModalOpen(true)
                popupsActions.setWaitingPayload({
                    title: 'Waiting For Confirmation',
                    hint: 'Confirm this transaction in your wallet',
                    status: 'loading',
                })
                const signer = library.getSigner(account)

                await getReservesCallback(signer, {
                    safeId: Number(safeId),
                    saviourAddress,
                })
            } catch (e) {
                handleTransactionError(e)
            } finally {
                setIsLoading(false)
            }
        } else {
            history.push(`/safes/${safeId}/saviour`)
        }
    }

    const returnStatus = useCallback((): {
        status: 'none' | 'Protected' | 'Unprotected'
        color: 'dimmedColor' | 'successColor' | 'dangerColor'
    } => {
        if (!saviourData) return { status: 'none', color: 'dimmedColor' }
        const minimumBalance = getMinSaviourBalance({
            type: safeState.saviourType,
            targetedCRatio: saviourData.saviourRescueRatio,
            totalDebt,
            totalCollateral,
        }) as number
        if (Number(saviourData.saviourBalance) >= minimumBalance) {
            return { status: 'Protected', color: 'successColor' }
        }
        return { status: 'Unprotected', color: 'dangerColor' }
    }, [
        getMinSaviourBalance,
        safeState.saviourType,
        saviourData,
        totalCollateral,
        totalDebt,
    ])

    const returnSaviourBtnText = () => {
        if (leftOver && leftOver.status) {
            return t('Collect Saviour Balance')
        } else {
            return (
                <BtnInner>
                    <Link2 size={18} />
                    {t(hasSaviour ? 'Saviour Configuration' : 'add_savoiur')}
                </BtnInner>
            )
        }
    }

    const handleBack = useCallback(() => {
        if (isModifying && safeId) {
            history.push(`/safes/${safeId}`)
        } else {
            history.push(`/`)
        }
    }, [history, isModifying, safeId])

    return (
        <Container>
            <BackBtn id="back-btn" onClick={handleBack}>
                <ArrowLeft size="16" /> Back
            </BackBtn>
            <HeaderContainer>
                <LeftSide>
                    <SafeInfo>
                        <UpperInfo>
                            Safe <span>#{safeId}</span>
                        </UpperInfo>
                        {hasSaviour ? (
                            <BottomInfo color={returnStatus().color}>
                                <Shield size="12" /> Saviour Status:{' '}
                                <span>
                                    {returnStatus().status === 'none'
                                        ? 'Loading...'
                                        : returnStatus().status}
                                </span>
                            </BottomInfo>
                        ) : null}
                    </SafeInfo>
                    {isOwner ? (
                        <BtnContainer>
                            <Button
                                onClick={() => handleSaviourBtnClick(leftOver)}
                                isLoading={loading}
                                disabled={loading}
                                secondary
                            >
                                {returnSaviourBtnText()}
                            </Button>
                        </BtnContainer>
                    ) : null}
                </LeftSide>
                <RightSide>
                    <LinkButton
                        id="deposit_borrow"
                        text={'Deposit & Borrow'}
                        url={`/safes/${safeId}/deposit`}
                        color={'colorPrimary'}
                    />
                    <LinkButton
                        id="repay_withdraw"
                        text={'Repay & Withdraw'}
                        url={`/safes/${safeId}/withdraw`}
                        color={'blueish'}
                    />
                </RightSide>
            </HeaderContainer>
        </Container>
    )
}

export default SafeHeader

const Container = styled.div``

const BackBtn = styled.div`
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.colors.secondary};
    cursor: pointer;
    max-width: fit-content;
    svg {
        margin-right: 5px;
    }
`

const BtnContainer = styled.div`
    margin-left: 20px;
    button {
        min-width: 100px;
        padding: 4px 12px;
        font-size: 13px;
        font-weight: normal;
    }
    @media (max-width: 767px) {
        margin-left: auto;
    }
`

const HeaderContainer = styled.div`
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    @media (max-width: 767px) {
        flex-direction: column;
    }
`

const LeftSide = styled.div`
    display: flex;
    @media (max-width: 767px) {
        min-width: 100%;
    }
`

const RightSide = styled.div`
    display: flex;
    align-items: center;

    a {
        min-width: 100px;
        padding: 4px 12px;
        font-size: 13px;
        font-weight: normal;
        &:first-child {
            margin-right: 10px;
        }
    }
    @media (max-width: 767px) {
        min-width: 100%;
        margin-top: 20px;
        justify-content: space-between;
        &:first-child {
            margin-right: 0;
        }
        a {
            min-width: 49%;
            display: flex;
            justify-content: center;
        }
    }
`

const SafeInfo = styled.div``

const UpperInfo = styled.div`
    font-size: ${(props) => props.theme.font.medium};
    font-weight: 600;
    min-width: 180px;
    span {
        color: ${(props) => props.theme.colors.blueish};
    }
    margin-top: 5px;
`
const BtnInner = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    svg {
        color: ${(props) => props.theme.colors.blueish};
    }
`

const BottomInfo = styled.div<{
    color?: 'dimmedColor' | 'successColor' | 'dangerColor'
}>`
    font-size: 11px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    span {
        color: ${({ theme, color }) =>
            color ? theme.colors[color] : theme.colors.blueish};
        margin-left: 5px;
    }
    svg {
        color: ${({ theme, color }) =>
            color ? theme.colors[color] : theme.colors.blueish};
        margin-right: 3px;
    }
`
