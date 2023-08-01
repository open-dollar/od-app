import { useCallback } from 'react'
import { ArrowLeft } from 'react-feather'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import Button from '~/components/Button'
import LinkButton from '~/components/LinkButton'
import { useStoreActions, useStoreState } from '~/store'

const VaultHeader = ({
    safeId,
    isModifying,
    isDeposit,
}: {
    safeId: string
    isModifying: boolean
    isDeposit: boolean
}) => {
    const history = useHistory()
    const { openLiquidateSafeModal } = useStoreActions((state) => state.popupsModel)
    const { singleSafe } = useStoreState((state) => state.safeModel)

    const handleBack = useCallback(() => {
        history.push(`/vaults`)
    }, [history])

    const canLiquidate = singleSafe && singleSafe.riskState == 4

    return (
        <Container>
            <BackBtn id="back-btn" onClick={handleBack}>
                <ArrowLeft size="16" /> Back
            </BackBtn>
            <HeaderContainer>
                <LeftSide>
                    <SafeInfo>
                        <UpperInfo>
                            Vault <span>#{safeId}</span>
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

const Container = styled.div``

const BackBtn = styled.div`
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.colors.secondary};
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
    min-width: 180px;
    span {
        color: ${(props) => props.theme.colors.blueish};
    }
    margin-top: 5px;
`
