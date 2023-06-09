import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useStoreState, useStoreActions } from '../../store'
import Accounts from './Accounts'
import SafeList from './SafeList'
import Button from '../../components/Button'
import useGeb from '../../hooks/useGeb'
import { useActiveWeb3React } from '../../hooks'
import { isAddress } from '@ethersproject/address'

const OnBoarding = ({ ...props }) => {
    const { t } = useTranslation()
    const [isOwner, setIsOwner] = useState(true)
    const { account, library } = useActiveWeb3React()
    const geb = useGeb()

    const {
        connectWalletModel: connectWalletState,
        safeModel: safeState,
        popupsModel: popupsState,
    } = useStoreState((state) => state)
    const { popupsModel: popupsActions, safeModel: safeActions } =
        useStoreActions((state) => state)

    const address: string = props.match.params.address ?? ''

    useEffect(() => {
        if (
            (!account && !address) ||
            (address && !isAddress(address.toLowerCase())) ||
            !library
        )
            return

        async function fetchSafes() {
            await safeActions.fetchUserSafes({
                address: address || (account as string),
                geb,
                isRPCAdapterOn: true,
            })
        }
        fetchSafes()
        const ms = 3000
        const interval = setInterval(() => {
            fetchSafes()
        }, ms)

        return () => clearInterval(interval)
    }, [account, library, safeActions, geb, address])

    useEffect(() => {
        if (account && address) {
            setIsOwner(account.toLowerCase() === address.toLowerCase())
        }
    }, [address, account])

    return (
        <Container id="app-page">
            <Content>
                {(account && !safeState.safeCreated) ||
                (!isOwner && !safeState.list.length) ? (
                    <BtnContainer className="top-up">
                        <Button
                            data-test-id="topup-btn"
                            disabled={connectWalletState.isWrongNetwork}
                            onClick={() =>
                                popupsActions.setIsSafeManagerOpen(true)
                            }
                        >
                            <BtnInner>{t('manage_other_safes')}</BtnInner>
                        </Button>
                    </BtnContainer>
                ) : null}
                {safeState.safeCreated ? (
                    <SafeList address={address} />
                ) : popupsState.isWaitingModalOpen ? null : (
                    <Accounts />
                )}
            </Content>
        </Container>
    )
}

export default OnBoarding

const Container = styled.div``

const Content = styled.div`
    position: relative;
`

const BtnContainer = styled.div`
    position: absolute;
    top: 25px;
    right: 50px;
    button {
        min-width: 100px;
        padding: 4px 12px;
    }
    &.top-up {
        right: auto;
        left: 50px;
        top: 50px;
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
      position: static;
      margin-bottom:20px;
      &.top-up {
         display:none;
        }
    `}
`

const BtnInner = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`
