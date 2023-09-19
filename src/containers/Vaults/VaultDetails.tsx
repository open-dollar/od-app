import {useEffect, useMemo, useState} from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useActiveWeb3React, useIsOwner } from '~/hooks'
import { useStoreActions, useStoreState } from '~/store'
import {isNumeric, DEFAULT_SAFE_STATE, parseWad, ISafe, formatUserSafe, ILiquidationData} from '~/utils'
import AlertLabel from '~/components/AlertLabel'
import VaultStats from '~/components/VaultStats'
import ModifyVault from './ModifyVault'
import VaultHeader from './VaultHeader'
import useGeb from "~/hooks/useGeb";
import { fetchUserSafes } from "@usekeyp/od-sdk/lib/virtual/virtualUserSafes.js";
import gebManager from "~/utils/gebManager";

const VaultDetails = ({ ...props }) => {
    const geb = useGeb()
    const { t } = useTranslation()
    const { account, provider } = useActiveWeb3React()
    const [finalSafe, setFinalSafe] = useState<any>(null);


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

    useEffect(() => {
        const fetchData = async () => {
            let fetchedSafe = null
            if (safe) {
                safeActions.setSingleSafe(safe);
                safeActions.setSafeData(DEFAULT_SAFE_STATE);
            }

            if (!safe && geb && safeId) {
                const safeDataResponse = await geb.contracts.safeManager.safeData(safeId);
                // const [userCoinBalance, safesData] = await fetchUserSafes(geb, '0xc295763eed507d4a0f8b77241c03dd3354781a15')
                // const safess = safesData.map((safe) => ({
                //     collateral: parseWad(safe.lockedCollateral),
                //     debt: parseWad(safe.generatedDebt),
                //     createdAt: null,
                //     safeHandler: safe.addy,
                //     safeId: safe.id.toString(),
                //     collateralType: safe.collateralType,
                // }))
                // fetchedSafe = safess.find((safe) => safe.safeId === safeId)
                console.log(safeDataResponse, 'safeDataResponse')
                console.log(fetchedSafe, 'fetchedSafe')
                const secondResp = await gebManager.getUserSafesRpc({   address: '0xc295763eed507d4a0f8b77241c03dd3354781a15',
                    geb,
                    tokensData: geb.tokenList,
                })
                const newResp = secondResp.safes.find((safe) => safe.safeId === safeId)
                console.log(newResp, 'newResp')
                const properSafe = formatUserSafe([newResp], liquidationData as ILiquidationData, geb.tokenList)
                safeActions.setSingleSafe(properSafe[0])
                safeActions.setSafeData(DEFAULT_SAFE_STATE);
                // safeActions.setSafeData({
                //     leftInput: '0',
                //     rightInput: '0',
                //     totalCollateral: '0',
                //     totalDebt: totalDebt,
                //     collateralRatio: Number(collateralRatio),
                //     liquidationPrice: Number(liquidationPrice),
                //     collateral: properSafe[0].collateral,
                // })
            }
        };
        fetchData();
        return () => {
            safeActions.setSingleSafe(null)
        }
    }, [safe, safeActions])

    useEffect(() => {
        if (!account || !provider) return
        if (!isNumeric(safeId)) {
            props.history.push('/vaults')
        }
    }, [account, provider, props.history, safeId])

    const isLoading = !(liquidationData && singleSafe?.collateralName)

    console.log(isLoading, 'isLoading')
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
