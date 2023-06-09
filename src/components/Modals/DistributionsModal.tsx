import { BigNumber, BigNumberish, utils } from 'ethers'
import React, { useState } from 'react'
import { X } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import {
    useClaimableDistributions,
    useClaimDistribution,
    useHasClaimableDistributions,
} from '../../hooks/useClaim'
import { utils as gebUtils } from 'geb.js'
import { useStoreActions, useStoreState } from '../../store'
import Modal from './Modal'
import { NETWORK_ID } from '../../connectors'
import { toFixedString } from '../../utils/helper'
import { Distribution } from '../../utils/interfaces'
import { handleTransactionError } from '../../hooks/TransactionHooks'
import FLXLogo from '../Icons/FLXLogo'
import dayjs from 'dayjs'

const DistributionsModal = () => {
    const { account, library } = useActiveWeb3React()
    const { t } = useTranslation()
    const hasClaim = useHasClaimableDistributions()
    const { checkClaimsCB, claimableDistributions } =
        useClaimableDistributions()
    const { claimCallBack } = useClaimDistribution()
    const { popupsModel: popupsState, connectWalletModel: connectWalletState } =
        useStoreState((state) => state)
    const { popupsModel: popupsActions } = useStoreActions((state) => state)

    const [isClaiming, setIsClaiming] = useState(false)

    const flxBalance = connectWalletState.flxBalance[NETWORK_ID].toString()
    const claimableAmount = connectWalletState.claimableFLX

    const handleClose = () => {
        popupsActions.setHasFLXClaim(false)
        popupsActions.setIsDistributionsModalOpen(false)
    }

    const returnAmount = (value: BigNumberish) => utils.formatEther(value)

    const totalBalance = (balance: string, totalClaim: string) => {
        const balanaceBN = balance
            ? BigNumber.from(toFixedString(balance))
            : BigNumber.from('0')
        const totalClaimBN = BigNumber.from(toFixedString(totalClaim, 'WAD'))

        return gebUtils.wadToFixed(balanaceBN.add(totalClaimBN)).toString()
    }

    const handleClaim = async (distribution: Distribution) => {
        if (!distribution || !account || !library) {
            console.debug('no distribution, account or library')
            return
        }
        try {
            setIsClaiming(true)
            handleClose()
            popupsActions.setIsWaitingModalOpen(true)
            popupsActions.setWaitingPayload({
                title: 'Waiting For Confirmation',
                text: 'Claiming FLX',
                hint: 'Confirm this transaction in your wallet',
                status: 'loading',
            })
            const signer = library.getSigner(account)
            await claimCallBack(account, signer, distribution)
            checkClaimsCB()
            setIsClaiming(false)
        } catch (e) {
            setIsClaiming(false)
            handleTransactionError(e)
        }
    }

    const returnDaysLeftToClaim = (date: number) => {
        const deploymentTime = dayjs(date * 1000)
        const dayDiff = dayjs().diff(deploymentTime, 'day')
        if (dayDiff > 90) {
            return 0
        }
        return 90 - dayjs().diff(deploymentTime, 'day')
    }

    return (
        <Modal
            width={'450px'}
            handleModalContent
            backDropClose
            startConfetti={popupsState.hasFLXClaim}
            closeModal={handleClose}
            isModalOpen={popupsState.isDistributionsModalOpen}
        >
            <Container data-test-id="distributions-popup">
                <Header>
                    <Title>{t('flx_breakdown')}</Title>
                    <CloseBtn onClick={handleClose}>
                        <X color={'white'} />
                    </CloseBtn>
                </Header>

                <Body>
                    <FLXLogo />

                    <Balance data-test-id="flx-total-balance">
                        {totalBalance(flxBalance, claimableAmount).slice(0, 10)}{' '}
                        FLX
                    </Balance>

                    <Blocks>
                        <Block>
                            <Label>{t('your_balance')}:</Label>
                            <Value data-test-id="flx-balance">
                                {flxBalance.slice(0, 10)}
                            </Value>
                        </Block>
                        <Block>
                            <Label>{t('unclaimed')}:</Label>
                            <Value data-test-id="claimable-flx">
                                {claimableAmount.slice(0, 10)}
                            </Value>
                        </Block>
                    </Blocks>
                    <Claims>
                        {hasClaim && account
                            ? claimableDistributions.map(
                                  (distribution, index: number) => {
                                      return (
                                          <ClaimBlock
                                              key={
                                                  index +
                                                  distribution.description
                                              }
                                          >
                                              <Info>
                                                  <ClaimTitle>
                                                      {distribution.description}
                                                      {' - '}
                                                      <span
                                                          style={{
                                                              fontSize: '12px',
                                                          }}
                                                      >
                                                          {returnDaysLeftToClaim(
                                                              distribution.createdAt
                                                          )}{' '}
                                                          days left
                                                      </span>
                                                  </ClaimTitle>
                                                  <ClaimDesc>
                                                      You can claim{' '}
                                                      <b>
                                                          {returnAmount(
                                                              distribution.amount
                                                          )}
                                                      </b>{' '}
                                                      FLX
                                                  </ClaimDesc>
                                              </Info>
                                              <Action>
                                                  <ClaimBtn
                                                      disabled={isClaiming}
                                                      onClick={() =>
                                                          handleClaim(
                                                              distribution
                                                          )
                                                      }
                                                  >
                                                      {isClaiming
                                                          ? 'Claiming...'
                                                          : t('claim')}
                                                  </ClaimBtn>
                                              </Action>
                                          </ClaimBlock>
                                      )
                                  }
                              )
                            : null}
                    </Claims>
                </Body>
            </Container>
        </Modal>
    )
}

export default DistributionsModal

const Container = styled.div`
    background: ${(props) => props.theme.colors.foreground};
    padding: 25px;
    border-radius: 25px;
`

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const Title = styled.div`
    color: #fff;
    font-size: 20px;
`

const CloseBtn = styled.div`
    cursor: pointer;
    transition: all 0.3s ease;
`

const Body = styled.div`
    text-align: center;
    margin-top: 40px;
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

const Block = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
`

const Label = styled.div`
    color: white;
`

const Value = styled.div`
    color: white;
`

const Blocks = styled.div`
    margin: 40px 0 0;
`

const Claims = styled.div`
    margin-top: 30px;
`

const ClaimBlock = styled.div`
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    &:before {
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(225deg, #78d8ff 0%, #53dea5 100%);
        content: '';
        width: 100%;
        height: 100%;
        z-index: 0;
        border-radius: 10px;
        opacity: 0.75;
    }

    &:nth-child(even) {
        &:before {
            background: linear-gradient(225deg, #9955ea 0%, #36aff7 100%);
        }
    }

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction:column;
    
  `}
`

const Info = styled.div`
    color: #fff;
    text-align: left;
    position: relative;
    z-index: 1;
`

const ClaimTitle = styled.div`
    font-weight: bold;
    font-size: 15px;
`

const ClaimDesc = styled.div`
    font-size: 12px;
    margin-top: 3px;
`

const Action = styled.div`
    position: relative;
    z-index: 1;
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top:10px;
    flex: 0 0 100%;
    min-width:100%;
    button {
        width:100%;
    }
    
  `}
`

const ClaimBtn = styled.button`
    &:disabled {
        cursor: not-allowed;
        background: rgba(255, 255, 255, 0.45) !important;
    }
    border: 0;
    box-shadow: none;
    padding: 10px 15px;
    border-radius: 10px;
    color: #fff;
    outline: none;
    font-size: 16px;
    background: rgba(255, 255, 255, 0.25);
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        background: rgba(255, 255, 255, 0.45);
    }
`
