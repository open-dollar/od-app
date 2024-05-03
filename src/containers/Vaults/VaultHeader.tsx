import { useCallback } from 'react'
import { ChevronLeft } from 'react-feather'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import Button from '~/components/Button'
import { useStoreActions, useStoreState } from '~/store'

const VaultHeader = ({ safeId }: { safeId: string }) => {
    const history = useHistory()
    const { openLiquidateSafeModal } = useStoreActions((state) => state.popupsModel)
    const { singleSafe } = useStoreState((state) => state.safeModel)

    const handleBack = useCallback(() => {
        history.push(`/vaults`)
    }, [history])

    const canLiquidate = singleSafe && Number(singleSafe.riskState) === 4

    return (
        <Container>
            <BackBtn id="back-btn" onClick={handleBack}>
                <ChevronLeft size={18} /> BACK
            </BackBtn>
            <HeaderContainer>
                <LeftSide>
                    <SafeInfo>
                        <UpperInfo>
                            {singleSafe?.collateralName} Vault <VaultNumberContainer>#{safeId}</VaultNumberContainer>
                        </UpperInfo>
                    </SafeInfo>
                </LeftSide>
                <RightSide>
                    {canLiquidate && (
                        <Button
                            id="liquidate-btn"
                            text="Liquidate Vault"
                            onClick={() => openLiquidateSafeModal({ safeId })}
                        />
                    )}
                </RightSide>
            </HeaderContainer>
        </Container>
    )
}

export default VaultHeader

const Container = styled.div`
    padding-left: 18px;
`

const VaultNumberContainer = styled.span`
    font-size: 30px;
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    color: #1a74ec;
    margin-left: 10px;
`

const BackBtn = styled.div`
    margin-bottom: 20px;
    font-size: 16px;
    display: flex;
    align-items: center;
    font-weight: 700;
    font-family: 'Open Sans', sans-serif;
    color: #1c293a;
    cursor: pointer;
    max-width: fit-content;
    svg {
        margin-right: 5px;
    }

    transition: opacity 0.3s ease;
    &:hover {
        opacity: 0.8;
    }
`

const HeaderContainer = styled.div`
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    @media (max-width: 767px) {
        flex-direction: column;
    }
    #liquidate-btn {
        background-color: crimson;
        min-width: 100px;
        padding: 4px 12px;
        font-size: 13px;
        font-weight: normal;
        margin-right: 10px;
        @media (max-width: 767px) {
            min-width: 100%;
            margin-bottom: 20px;
            margin-right: 0;
        }
    }
`

const LeftSide = styled.div`
    display: flex;
    @media (max-width: 767px) {
        min-width: 100%;
    }
`

const RightSide = styled.div`
    display: flex;
    align-items: center;

    a {
        min-width: 100px;
        padding: 4px 12px;
        font-size: 13px;
        font-weight: normal;
        &:not(:last-child) {
            margin-right: 10px;
        }
    }
    @media (max-width: 767px) {
        min-width: 100%;
        justify-content: space-between;
        display: block;
        a {
            &:not(:last-child) {
                margin-right: 0px;
            }
            margin-bottom: 20px;
            min-width: 49%;
            display: flex;
            justify-content: center;
        }
    }
`

const SafeInfo = styled.div``

const UpperInfo = styled.div`
    font-size: 34px;
    font-weight: 700;
    font-family: 'Barlow', sans-serif;
    min-width: 180px;
    color: #1c293a;
    margin-bottom: 40px;
`
