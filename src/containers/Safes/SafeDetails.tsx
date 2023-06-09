import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import AlertLabel from '../../components/AlertLabel'
import SafeHistory from '../../components/SafeHistory'
import SafeStats from '../../components/SafeStats'
import { useActiveWeb3React } from '../../hooks'
import useGeb, { useIsOwner } from '../../hooks/useGeb'
import { useStoreActions, useStoreState } from '../../store'
import { isNumeric } from '../../utils/validations'
import ModifySafe from './ModifySafe'
import SafeHeader from './SafeHeader'

const SafeDetails = ({ ...props }) => {
    const { t } = useTranslation()
    const { account, library } = useActiveWeb3React()

    const geb = useGeb()
    const { safeModel: safeActions, popupsModel: popupsActions } =
        useStoreActions((state) => state)
    const { connectWalletModel: connectWalletState } = useStoreState(
        (state) => state
    )

    const { fiatPrice: ethPrice } = connectWalletState

    const safeId = props.match.params.id as string

    const isDeposit = useMemo(() => {
        if (props.location) {
            return props.location.pathname.includes('deposit')
        }
        return false
    }, [props])

    const isWithdraw = useMemo(() => {
        if (props.location) {
            return props.location.pathname.includes('withdraw')
        }
        return false
    }, [props])

    const isOwner = useIsOwner(safeId)

    useEffect(() => {
        if (!account || !library) return
        if (!isNumeric(safeId)) {
            props.history.push('/')
        }

        async function fetchSafe() {
            popupsActions.setIsWaitingModalOpen(true)
            popupsActions.setWaitingPayload({
                title: 'Fetching Safe Data',
                status: 'loading',
            })
            try {
                const safe = await safeActions.fetchSafeById({
                    safeId,
                    address: account as string,
                    geb,
                    isRPCAdapterOn: true,
                })
                await safeActions.fetchSafeHistory(safeId)

                if (safe) {
                    popupsActions.setIsWaitingModalOpen(false)
                }
            } catch (error) {
                console.log('error')
                popupsActions.setIsWaitingModalOpen(false)
            }
        }

        fetchSafe()

        const ms = 3000

        const interval = setInterval(() => {
            try {
                safeActions.fetchSafeById({
                    safeId,
                    address: account as string,
                    geb,
                    isRPCAdapterOn: true,
                })
                safeActions.fetchSafeHistory(safeId)
            } catch (error) {
                console.log(error)
            }
        }, ms)

        return () => {
            clearInterval(interval)
            safeActions.setSingleSafe(null)
            safeActions.setSafeHistoryList([])
        }
    }, [
        account,
        geb,
        library,
        popupsActions,
        props.history,
        safeActions,
        safeId,
    ])

    const fetchSaviourDataCallback = useCallback(() => {
        if (!account || !geb || !safeId) return
        safeActions.fetchSaviourData({
            account,
            geb,
            safeId,
            ethPrice,
        })
    }, [account, ethPrice, geb, safeActions, safeId])

    useEffect(() => {
        fetchSaviourDataCallback()
    }, [fetchSaviourDataCallback])

    return (
        <Container>
            {!isOwner ? (
                <LabelContainer>
                    <AlertLabel
                        isBlock={false}
                        text={t('managed_safe_warning')}
                        type="warning"
                    />
                </LabelContainer>
            ) : null}
            <SafeHeader
                safeId={safeId}
                isModifying={isDeposit || isWithdraw}
                isDeposit={isDeposit}
            />

            <SafeStats
                isModifying={isDeposit || isWithdraw}
                isDeposit={isDeposit}
                isOwner={isOwner}
            />

            {isDeposit || isWithdraw ? (
                <ModifySafe isDeposit={isDeposit} isOwner={isOwner} />
            ) : null}
            {!isDeposit && !isWithdraw ? (
                <SafeHistory hideHistory={false} />
            ) : null}
        </Container>
    )
}

export default SafeDetails

const Container = styled.div`
    max-width: 880px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`

const LabelContainer = styled.div`
    max-width: ${(props) => props.theme.global.gridMaxWidth};
    margin: 0 auto 20px auto;
`
