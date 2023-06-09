import { isAddress } from '@ethersproject/address'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useActiveWeb3React } from '../hooks'
import useGeb from '../hooks/useGeb'
import { fetchUserSafes } from '../services/graphql'
import { useStoreActions, useStoreState } from '../store'
import { timeout } from '../utils/helper'
import Button from './Button'

const SafeManager = () => {
    const { t } = useTranslation()
    const { account } = useActiveWeb3React()
    const geb = useGeb()
    const [error, setError] = useState('')
    const [value, setValue] = useState('')

    const history = useHistory()

    const { settingsModel: settingsState } = useStoreState((state) => state)

    const { popupsModel: popupsActions } = useStoreActions((state) => state)

    const { isRPCAdapterOn } = settingsState

    const handleCancel = () => {
        popupsActions.setIsSafeManagerOpen(false)
    }

    const handleSubmit = async () => {
        if (!value || (value && !isAddress(value))) {
            setError('Enter a valid ETH address')
            return
        }

        if (account && value.toLowerCase() === account.toLowerCase()) {
            setError('Cannot use your own address')
            return
        }

        try {
            const userSafes = await fetchUserSafes(
                { address: value, geb, isRPCAdapterOn },
                true
            )

            if (!userSafes || (userSafes && !userSafes.safes.length)) {
                setError('Address has no Safes')
                return
            }
            popupsActions.setIsWaitingModalOpen(true)
            history.push(`/${value}`)
            handleCancel()
            await timeout(3000)
            popupsActions.setIsWaitingModalOpen(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Body>
            <Label>ETH Address</Label>
            <CustomInput
                id="topup_input"
                value={value}
                placeholder={'Enter a valid ETH address'}
                onChange={(e) => setValue(e.target.value)}
            />

            {error && <Error>{error}</Error>}

            <Footer>
                <Button dimmed text={t('cancel')} onClick={handleCancel} />
                <Button
                    data-test-id="topup-manage"
                    withArrow
                    onClick={handleSubmit}
                    text={t('manage_safe')}
                />
            </Footer>
        </Body>
    )
}

export default SafeManager

const Body = styled.div`
    padding: 20px;
`

const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 0 0 0;
`

const Error = styled.p`
    color: ${(props) => props.theme.colors.dangerColor};
    font-size: ${(props) => props.theme.font.extraSmall};
    width: 100%;
    margin: 16px 0;
`

const CustomInput = styled.input`
    font-size: ${(props) => props.theme.font.default};
    transition: all 0.3s ease;
    width: 100%;
    padding: 20px;
    background: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.primary};
    line-height: 24px;
    outline: none;
    border: 1px solid ${(props) => props.theme.colors.border};
    border-radius: ${(props) => props.theme.global.borderRadius};
    transition: all 0.3s ease;
`

const Label = styled.div`
    line-height: 21px;
    color: ${(props) => props.theme.colors.secondary};
    font-size: ${(props) => props.theme.font.small};
    letter-spacing: -0.09px;
    margin-bottom: 4px;
    text-transform: capitalize;
`
