import React, { useEffect } from 'react'
import { X } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useActiveWeb3React } from '../hooks'
import {
    useHasClaimableDistributions,
    useShowClaimPopup,
} from '../hooks/useClaim'
import { useStoreActions, useStoreState } from '../store'
import { timeout } from '../utils/helper'
import Button from './Button'
import FLXLogo from './Icons/FLXLogo'

const ClaimPopup = () => {
    const { active, account } = useActiveWeb3React()
    const { t } = useTranslation()
    const { popupsModel: popupsActions } = useStoreActions((state) => state)
    const {
        popupsModel: popupsState,
        connectWalletModel: connectWalletState,
    } = useStoreState((state) => state)

    const handleClaimBtn = () => {
        popupsActions.setIsClaimPopupOpen(false)
        popupsActions.setHasFLXClaim(true)
        popupsActions.setIsDistributionsModalOpen(true)
    }

    const hasClaim = useHasClaimableDistributions()
    const showPopup = useShowClaimPopup()

    useEffect(() => {
        async function hideModal() {
            await timeout(10000)
            popupsActions.setIsClaimPopupOpen(false)
        }
        if (popupsState.isClaimPopupOpen) {
            hideModal()
        }
    }, [popupsActions, popupsState.isClaimPopupOpen])

    useEffect(() => {
        if (hasClaim) {
            popupsActions.setIsClaimPopupOpen(true)
        }
    }, [hasClaim, popupsActions])

    return account &&
        active &&
        hasClaim &&
        popupsState.isClaimPopupOpen &&
        showPopup ? (
        <Container>
            <Header>
                <CloseBtn
                    onClick={() => popupsActions.setIsClaimPopupOpen(false)}
                >
                    <X color={'white'} />
                </CloseBtn>
            </Header>

            <Body>
                <FLXLogo />
                <Balance>
                    {connectWalletState.claimableFLX.slice(0, 10)} FLX
                </Balance>

                <Blocks>
                    <Heading>{t('flx_is_live')}</Heading>
                    <Text>{t('flx_thank_you')}</Text>
                </Blocks>

                <BtnContainer>
                    <Button
                        text={'claim_flx_tokens'}
                        onClick={handleClaimBtn}
                    />
                </BtnContainer>
            </Body>
        </Container>
    ) : null
}

export default ClaimPopup

const Container = styled.div`
    background: #34496c;
    padding: 25px;
    border-radius: 20px;
    position: fixed;
    top: 45%;
    transform: translateY(-50%);
    right: 20px;
    z-index: 99;
    min-width: 300px;
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    right:0;
    left:0;
    margin:auto;
    max-width:95%;
    width:350px;
    
  `}
`

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
`

const CloseBtn = styled.div`
    cursor: pointer;
    transition: all 0.3s ease;
`

const Body = styled.div`
    text-align: center;
    margin-top: 20px;
    img {
        width: 76px;
        height: 76px;
        border-radius: 50%;
    }
`

const Balance = styled.div`
    font-size: 35px;
    font-weight: 900;
    color: white;
    margin-top: 10px;
`

const Heading = styled.div`
    color: white;
    font-weight: bold;
    font-size: 16px;
    text-align: center;
`

const Text = styled.div`
    color: white;
    font-size: 14px;
    text-align: center;
`

const Blocks = styled.div`
    margin: 20px 0 0;
`

const BtnContainer = styled.div`
    text-align: center;
    margin-top: 30px;
`
