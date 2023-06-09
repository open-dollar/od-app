import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useStoreActions, useStoreState } from '../store'
import Brand from './Brand'
import Button from './Button'
import FLXLogoSmall from './Icons/FLXLogoSmall'
import { newTransactionsFirst, returnWalletAddress } from '../utils/helper'
import { useWeb3React } from '@web3-react/core'
import { isTransactionRecent } from '../hooks/TransactionHooks'
import NavLinks from './NavLinks'
import { useTranslation } from 'react-i18next'
import Identicon from './Icons/Identicon'

const Navbar = () => {
    const { t } = useTranslation()
    const {
        transactionsModel: transactionsState,
        connectWalletModel: connectWalletState,
    } = useStoreState((state) => state)

    const { transactions } = transactionsState

    const { popupsModel: popupsActions } = useStoreActions((state) => state)
    const { active, account } = useWeb3React()

    const handleWalletConnect = () => {
        if (active && account) {
            return popupsActions.setIsConnectedWalletModalOpen(true)
        }
        return popupsActions.setIsConnectorsWalletOpen(true)
    }

    const sortedRecentTransactions = useMemo(() => {
        const txs = Object.values(transactions)
        return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
    }, [transactions])

    const pending = sortedRecentTransactions
        .filter((tx) => !tx.receipt)
        .map((tx) => tx.hash)

    const hasPendingTransactions = !!pending.length
    return (
        <Container>
            <Left isBigWidth={active && account ? true : false}>
                <Brand />
            </Left>
            <HideMobile>
                <NavLinks />
            </HideMobile>
            <RightSide>
                {active && account ? (
                    <Button
                        style={{ marginRight: '10px' }}
                        data-test-id="flx-btn"
                        onClick={() =>
                            popupsActions.setIsDistributionsModalOpen(true)
                        }
                        secondary
                    >
                        <Flex>
                            <LogoBox>
                                <FLXLogoSmall />
                            </LogoBox>
                            {connectWalletState.claimableFLX.slice(0, 10)} FLX
                        </Flex>
                    </Button>
                ) : null}
                <BtnContainer>
                    <Button
                        primary={active && account ? true : false}
                        id="web3-status-connected"
                        isLoading={hasPendingTransactions}
                        onClick={handleWalletConnect}
                    >
                        {active && account ? (
                            hasPendingTransactions ? (
                                `${pending.length} Pending`
                            ) : (
                                <InnerBtn>
                                    {returnWalletAddress(account)}
                                    <Identicon />
                                </InnerBtn>
                            )
                        ) : (
                            t('connect_wallet')
                        )}
                    </Button>
                </BtnContainer>

                <MenuBtn onClick={() => popupsActions.setShowSideMenu(true)}>
                    <RectContainer>
                        <Rect />
                        <Rect />
                        <Rect />
                    </RectContainer>
                </MenuBtn>
            </RightSide>
        </Container>
    )
}

export default Navbar

const Container = styled.div`
    display: flex;
    height: 68px;
    align-items: center;
    justify-content: space-between;
    padding: 40px 40px 0 40px;
    position: relative;
    z-index: 5;
    ${({ theme }) => theme.mediaWidth.upToSmall`
     padding: 0 20px;
     top:0 !important;
  `}
`

const MenuBtn = styled.div`
    margin-right: -20px;
    width: 60px;
    height: 60px;
    align-items: center;
    justify-content: center;
    display: none;
    cursor: pointer;
    &:hover {
        div {
            div {
                background: ${(props) => props.theme.colors.gradient};
            }
        }
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
    display: flex;
  `}
`

const BtnContainer = styled.div`
    display: flex;
    align-items: center;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `}

    svg {
        stroke: white;
        position: relative;
        top: 2px;
        margin-right: 5px;
    }
`

const RectContainer = styled.div``

const Rect = styled.div`
    width: 15px;
    border-radius: 12px;
    height: 3px;
    margin-bottom: 2px;
    background: ${(props) => props.theme.colors.secondary};
    transition: all 0.3s ease;
    &:last-child {
        margin-bottom: 0;
    }
`

const RightSide = styled.div`
    display: flex;
    align-items: center;
`

const HideMobile = styled.div`
    ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `}
`

const Left = styled.div<{ isBigWidth?: boolean }>`
    min-width: ${({ theme, isBigWidth }) => (isBigWidth ? '315px' : '171px')};
    display: flex;
    align-items: center;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width:auto;
  `}
`

const Flex = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
`
const LogoBox = styled.div`
    margin-right: 5px;
    display: flex;
    align-items: center;
`
const InnerBtn = styled(Flex)`
    div {
        display: block !important;
        margin-left: 5px;
        svg {
            top: 0 !important;
        }
    }
`
