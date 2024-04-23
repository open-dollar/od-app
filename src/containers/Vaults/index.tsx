import { useEffect, useState } from 'react'
import { isAddress } from '@ethersproject/address'
import styled from 'styled-components'

import { useStoreState, useStoreActions } from '~/store'
import { useActiveWeb3React } from '~/hooks'
import useGeb from '~/hooks/useGeb'
import Accounts from './Accounts'
import VaultList from './VaultList'

const OnBoarding = ({ ...props }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_isOwner, setIsOwner] = useState(true)
    const { account, provider, chainId } = useActiveWeb3React()
    const geb = useGeb()

    const {
        connectWalletModel: connectWalletState,
        safeModel: safeState,
        popupsModel: popupsState,
    } = useStoreState((state) => state)
    const { safeModel: safeActions } = useStoreActions((state) => state)

    const address: string = props.match.params.address ?? ''

    useEffect(() => {
        if (chainId !== 421614 && chainId !== 42161 && chainId !== 10) return
        if (
            (!account && !address) ||
            (address && !isAddress(address.toLowerCase())) ||
            !provider ||
            connectWalletState.isWrongNetwork
        )
            return

        async function fetchSafes() {
            await safeActions.fetchUserSafes({
                address: address || (account as string),
                geb,
                tokensData: connectWalletState.tokensData,
            })
        }

        if (geb && connectWalletState.tokensData) {
            fetchSafes()
        }

        const ms = 3000
        const interval = setInterval(() => {
            if (
                (!account && !address) ||
                (address && !isAddress(address.toLowerCase())) ||
                !provider ||
                connectWalletState.isWrongNetwork
            )
                fetchSafes()
        }, ms)

        return () => clearInterval(interval)
    }, [
        account,
        address,
        connectWalletState.isWrongNetwork,
        connectWalletState.tokensData,
        geb,
        provider,
        safeActions,
        chainId,
    ])

    useEffect(() => {
        if (account && address) {
            setIsOwner(account.toLowerCase() === address.toLowerCase())
        }
    }, [address, account])

    return (
        <Container id="app-page">
            <Content>
                {safeState.safeCreated && <VaultList address={address} />}
                {!popupsState.isWaitingModalOpen && <Accounts />}
            </Content>
        </Container>
    )
}

export default OnBoarding

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Content = styled.div`
    position: relative;
    max-width: 880px;
`
