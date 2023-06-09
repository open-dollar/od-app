import React, { useState } from 'react'
import styled from 'styled-components'
import Escrow from './Escrow'
import Stake from './Stake'
import UnStake from './UnStake'

const StakingManager = () => {
    const [type, setType] = useState<'stake' | 'unstake' | 'escrow'>('stake')

    return (
        <StakingPayment>
            <Header>
                <Tab
                    className={type === 'stake' ? 'active' : ''}
                    onClick={() => setType('stake')}
                >
                    Stake
                </Tab>
                <Tab
                    className={type === 'unstake' ? 'active' : ''}
                    onClick={() => setType('unstake')}
                >
                    Unstake
                </Tab>
                <Tab
                    className={type === 'escrow' ? 'active' : ''}
                    onClick={() => setType('escrow')}
                >
                    Escrow
                </Tab>
            </Header>
            {type === 'escrow' ? (
                <Escrow />
            ) : type === 'unstake' ? (
                <UnStake />
            ) : (
                <Stake />
            )}
        </StakingPayment>
    )
}

export default StakingManager

const StakingPayment = styled.div`
    background: ${(props) => props.theme.colors.placeholder};
    border-radius: 15px;
    flex: 4;
    margin-right: 20px;
    ${({ theme }) => theme.mediaWidth.upToSmall`
   margin-right:0
 `}
`

const Header = styled.div`
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
    padding: 0px 20px 0;
`

const Tab = styled.div`
    color: ${(props) => props.theme.colors.secondary};
    position: relative;
    padding: 20px 10px;
    cursor: pointer;
    &.active {
        color: ${(props) => props.theme.colors.primary};
        :before {
            content: '';
            height: 2px;
            width: 100%;
            bottom: 0;
            left: 0;
            position: absolute;
            background: ${(props) => props.theme.colors.gradient};
        }
    }
`
