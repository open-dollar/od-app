import { useState } from 'react'
import { isAddress } from '@ethersproject/address'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { useStoreActions, useStoreState } from '~/store'
import { fetchUserSafesRaw } from '~/services/safes'
import { timeout, IUserSafeList } from '~/utils'
import { useActiveWeb3React } from '~/hooks'
import useGeb from '~/hooks/useGeb'
import Button from './Button'

const VaultManager = () => {
    const { t } = useTranslation()
    const { account } = useActiveWeb3React()
    const geb = useGeb()
    const [error, setError] = useState('')
    const [value, setValue] = useState('')

    const navigate = useNavigate()

    const { popupsModel: popupsActions } = useStoreActions((state) => state)
    const { tokensData } = useStoreState((state) => state.connectWalletModel)

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
            const userSafes: IUserSafeList | undefined = await fetchUserSafesRaw({ address: value, geb, tokensData })

            if (!userSafes || (userSafes && !userSafes.safes.length)) {
                setError('Address has no Vaults')
                return
            }
            popupsActions.setIsWaitingModalOpen(true)
            if (window?.location) {
                window.location.assign(`/${value}`)
            } else {
                navigate(`/${value}`)
            }
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
                <WhiteButton dimmed text={t('cancel')} style={{ color: 'white' }} onClick={handleCancel} />
                <ManageVaultButton>
                    <span>{t('manage_safe')}</span>
                    <WhiteButton data-test-id="topup-manage" withArrow onClick={handleSubmit} />
                </ManageVaultButton>
            </Footer>
        </Body>
    )
}

export default VaultManager

const ManageVaultButton = styled.div`
    display: flex;
    gap: 8px;
    color: white;
    font-size: ${(props) => props.theme.font.small};
    font-weight: 600;
`

const WhiteButton = styled(Button)`
    color: white;
`

const Body = styled.div`
    padding: 20px;
`

const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 0 0 0;
`

const Error = styled.p`
    color: white;
    font-size: ${(props) => props.theme.font.xSmall};
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
    color: white;
    font-size: ${(props) => props.theme.font.small};
    letter-spacing: -0.09px;
    margin-bottom: 4px;
    text-transform: capitalize;
`
