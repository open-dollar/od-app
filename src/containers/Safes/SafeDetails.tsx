import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useActiveWeb3React, useIsOwner } from '~/hooks'
import { useStoreActions, useStoreState } from '~/store'
import { isNumeric, DEFAULT_SAFE_STATE } from '~/utils'
import AlertLabel from '~/components/AlertLabel'
import SafeStats from '~/components/SafeStats'
import ModifySafe from './ModifySafe'
import SafeHeader from './SafeHeader'

const SafeDetails = ({ ...props }) => {
    const { t } = useTranslation()
    const { account, library } = useActiveWeb3React()

    const { safeModel: safeActions } = useStoreActions((state) => state)

    const {
        safeModel: { liquidationData, singleSafe },
    } = useStoreState((state) => state)

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

    const { safeModel: safeState } = useStoreState((state) => state)

    const safes = safeState.list
    const safe = safes.find((safe) => safe.id === safeId)

    useEffect(() => {
        if (safe) {
            safeActions.setSingleSafe(safe)
            safeActions.setSafeData(DEFAULT_SAFE_STATE)
        }
        return () => {
            safeActions.setSingleSafe(null)
        }
    }, [safe, safeActions])

    useEffect(() => {
        if (!account || !library) return
        if (!isNumeric(safeId)) {
            props.history.push('/safes')
        }
    }, [account, library, props.history, safeId])

    const isLoading = !(liquidationData && singleSafe?.collateralName)

    return (
        <Container>
            {!isOwner ? (
                <LabelContainer>
                    <AlertLabel isBlock={false} text={t('managed_safe_warning')} type="warning" />
                </LabelContainer>
            ) : null}
            <SafeHeader safeId={safeId} isModifying={isDeposit || isWithdraw} isDeposit={isDeposit} />

            {!isLoading && <SafeStats isModifying={isDeposit || isWithdraw} isDeposit={isDeposit} isOwner={isOwner} />}

            {(isDeposit || isWithdraw) && !isLoading ? <ModifySafe isDeposit={isDeposit} isOwner={isOwner} /> : null}
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
