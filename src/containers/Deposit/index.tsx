import React, { useEffect, useState } from 'react'
import { isAddress } from '@ethersproject/address'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useStoreState, useStoreActions } from '~/store'
import { useActiveWeb3React } from '~/hooks'

const OnBoarding = ({ ...props }) => {
    const { account, provider } = useActiveWeb3React()

    const {
        connectWalletModel: connectWalletState,
        safeModel: safeState,
        popupsModel: popupsState,
    } = useStoreState((state) => state)
    const { popupsModel: popupsActions, safeModel: safeActions } = useStoreActions((state) => state)

    const address: string = props.match.params.address ?? ''

    return (
        <Container id="app-page">
            <Content>
                Deposit page
            </Content>
        </Container>
    )
}

export default OnBoarding

const Container = styled.div``

const Content = styled.div`
    position: relative;
`
