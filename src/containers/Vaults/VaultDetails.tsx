import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useActiveWeb3React, useIsOwner } from '~/hooks'
import { useStoreActions, useStoreState } from '~/store'
import { isNumeric, DEFAULT_SAFE_STATE, formatUserSafe, ILiquidationData } from '~/utils'
import AlertLabel from '~/components/AlertLabel'
import VaultStats from '~/components/VaultStats'
import ModifyVault from './ModifyVault'
import VaultHeader from './VaultHeader'
import useGeb from '~/hooks/useGeb'
import gebManager from '~/utils/gebManager'
import { ethers } from 'ethers'

const VaultDetails = ({ ...props }) => {
    const geb = useGeb()
    const { t } = useTranslation()
    const { account, provider } = useActiveWeb3React()

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
    let safe = safes.find((safe) => safe.id === safeId)

    // Fetches vault data of a vault not owned by the user
    const fetchSingleVaultData = async () => {
        if (safe && safeId && geb) {
            safeActions.setSingleSafe(safe)
            safeActions.setSafeData(DEFAULT_SAFE_STATE)
        }

        if (!safe && geb && safeId && liquidationData) {
            const safeDataResponse = await geb.contracts.safeManager.safeData(safeId)
            const ODProxyAddress = safeDataResponse[0]
            if (ODProxyAddress.startsWith('0x000000')) {
                return
            }
            const ODProxyContract = new ethers.Contract(
                ODProxyAddress,
                '[{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"OnlyOwner","type":"error"},{"inputs":[],"name":"TargetAddressRequired","type":"error"},{"inputs":[{"internalType":"bytes","name":"_response","type":"bytes"}],"name":"TargetCallFailed","type":"error"},{"inputs":[],"name":"OWNER","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_target","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"execute","outputs":[{"internalType":"bytes","name":"_response","type":"bytes"}],"stateMutability":"payable","type":"function"}]',
                provider
            )
            const ownerAddress = await ODProxyContract.OWNER()
            const userSafes = await gebManager.getUserSafesRpc({
                address: ownerAddress,
                geb,
                tokensData: geb.tokenList,
            })
            const safeById = userSafes.safes.find((safe) => safe.safeId === safeId)
            if (!safeById) {
                return
            }
            const formattedSafe = formatUserSafe([safeById], liquidationData as ILiquidationData, geb.tokenList)
            safeActions.setSingleSafe(formattedSafe[0])
            safeActions.setSafeData(DEFAULT_SAFE_STATE)
        }
    }

    useEffect(() => {
        fetchSingleVaultData()
        return () => {
            safeActions.setSingleSafe(null)
        }
    }, [safe, safeActions, geb, liquidationData])

    useEffect(() => {
        if (!account || !provider) return
        if (!isNumeric(safeId)) {
            props.history.push('/vaults')
        }
    }, [account, provider, props.history, safeId])

    const isLoading = !(liquidationData && singleSafe?.collateralName)

    return (
        <Container>
            {!isOwner ? (
                <LabelContainer>
                    <AlertLabel isBlock={false} text={t('managed_safe_warning')} type="warning" />
                </LabelContainer>
            ) : null}
            <VaultHeader safeId={safeId} isModifying={isDeposit || isWithdraw} isDeposit={isDeposit} />

            {!isLoading && <VaultStats isModifying={isDeposit || isWithdraw} isDeposit={isDeposit} isOwner={isOwner} />}

            {(isDeposit || isWithdraw) && !isLoading ? (
                <ModifyVault vaultId={safeId} isDeposit={isDeposit} isOwner={isOwner} />
            ) : null}
        </Container>
    )
}

export default VaultDetails

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
