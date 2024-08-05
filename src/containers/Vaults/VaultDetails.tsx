import { useEffect, useMemo, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
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
import Loader from '~/components/Loader'

const VaultDetails = () => {
    const [error, setError] = useState(false)
    const geb = useGeb()
    const { t } = useTranslation()
    const { account, provider } = useActiveWeb3React()
    const { safeModel: safeActions } = useStoreActions((state) => state)
    const {
        safeModel: { liquidationData, singleSafe },
    } = useStoreState((state) => state)

    const { id } = useParams()
    const safeId = id ?? ''
    const location = useLocation()
    const navigate = useNavigate()

    const isDeposit = useMemo(() => location.pathname.includes('deposit'), [location.pathname])
    const isWithdraw = useMemo(() => location.pathname.includes('withdraw'), [location.pathname])

    const isOwner = useIsOwner(safeId)

    const { safeModel: safeState } = useStoreState((state) => state)
    const safes = safeState.list
    const safe = safes.find((safe) => safe.id === safeId)

    const [isLoading, setIsLoading] = useState(true)

    const fetchSingleVaultData = async () => {
        if (!isNumeric(safeId)) {
            setIsLoading(false)
            return
        }

        setIsLoading(true)

        if (safe && safeId && geb && liquidationData) {
            safeActions.setSingleSafe(safe)
            safeActions.setSafeData(DEFAULT_SAFE_STATE)
            setIsLoading(false)
            return
        }

        if (!safe && geb && safeId) {
            const safeDataResponse = await geb.contracts.safeManager.connect(geb.provider).safeData(safeId)
            const ODProxyAddress = safeDataResponse[1]
            if (ODProxyAddress.startsWith('0x000000')) {
                setError(true)
                setIsLoading(false)
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
            const { collateralLiquidationData } = userSafes
            const constructedLiquidationData: ILiquidationData = {
                currentRedemptionPrice: userSafes.systemState.currentRedemptionPrice.value,
                currentRedemptionRate: userSafes.systemState.currentRedemptionRate.annualizedRate,
                globalDebt: userSafes.systemState.globalDebt,
                perSafeDebtCeiling: userSafes.systemState.perSafeDebtCeiling,
                globalDebtCeiling: userSafes.systemState.globalDebtCeiling,
                collateralLiquidationData: collateralLiquidationData,
            }
            safeActions.setLiquidationData(constructedLiquidationData)
            const safeById = userSafes.safes.find((safe) => safe.safeId === safeId)
            if (!safeById) {
                setIsLoading(false)
                setError(true)
                return
            }
            const formattedSafe = formatUserSafe(
                [safeById],
                constructedLiquidationData as ILiquidationData,
                geb.tokenList
            )
            formattedSafe[0].ownerAddress = ownerAddress
            safeActions.setSingleSafe(formattedSafe[0])
            safeActions.setSafeData(DEFAULT_SAFE_STATE)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!liquidationData || !singleSafe) {
            fetchSingleVaultData()
        } else {
            setIsLoading(false)
        }
        return () => {
            safeActions.setSingleSafe(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [safeId, geb])

    useEffect(() => {
        if (!account || !provider) return
        if (!isNumeric(safeId)) {
            navigate('/vaults')
        }
    }, [account, provider, navigate, safeId])

    return (
        <>
            <Container>
                <VaultHeader safeId={safeId} />
                {error ? (
                    <ErrorMessage>This vault does not exist</ErrorMessage>
                ) : (
                    <>
                        {isLoading ? (
                            <LoaderContainer>
                                <Loader width="150px" color="#1A74EC" />
                            </LoaderContainer>
                        ) : (
                            <VaultStats isModifying={isDeposit || isWithdraw} isDeposit={isDeposit} isOwner={isOwner} />
                        )}

                        {(isDeposit || isWithdraw) && !isLoading && isOwner ? (
                            <ModifyVault vaultId={safeId} isDeposit={isDeposit} isOwner={isOwner} key={account} />
                        ) : null}

                        {/* Users can only repay debt from a vault they don't own */}
                        {!isLoading && !isOwner ? (
                            <ModifyVault vaultId={safeId} isDeposit={false} isOwner={isOwner} />
                        ) : null}

                        {!isOwner ? (
                            <LabelContainer>
                                <AlertLabel isBlock={false} text={t('managed_safe_warning')} type="warning" />
                            </LabelContainer>
                        ) : null}
                    </>
                )}
            </Container>
        </>
    )
}

export default VaultDetails

const ErrorMessage = styled.div`
    color: ${({ theme }) => theme.colors.error};
`

const Container = styled.div`
    max-width: 880px;
    margin: 50px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`

const LoaderContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const LabelContainer = styled.div`
    max-width: 810px;
    margin: 0 auto 20px auto;
`
