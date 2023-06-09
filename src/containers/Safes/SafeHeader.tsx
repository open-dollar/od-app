import { useCallback } from 'react'
import { ArrowLeft } from 'react-feather'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import LinkButton from '../../components/LinkButton'

const SafeHeader = ({
    safeId,
    isModifying,
    isDeposit,
}: {
    safeId: string
    isModifying: boolean
    isDeposit: boolean
}) => {
    const history = useHistory()

    const handleBack = useCallback(() => {
        if (isModifying && safeId) {
            history.push(`/safes/${safeId}`)
        } else {
            history.push(`/safes`)
        }
    }, [history, isModifying, safeId])

    return (
        <Container>
            <BackBtn id="back-btn" onClick={handleBack}>
                <ArrowLeft size="16" /> Back
            </BackBtn>
            <HeaderContainer>
                <LeftSide>
                    <SafeInfo>
                        <UpperInfo>
                            Safe <span>#{safeId}</span>
                        </UpperInfo>
                    </SafeInfo>
                </LeftSide>
                <RightSide>
                    <LinkButton
                        id="deposit_borrow"
                        text={'Deposit & Borrow'}
                        url={`/safes/${safeId}/deposit`}
                        color={'colorPrimary'}
                    />
                    <LinkButton
                        id="repay_withdraw"
                        text={'Repay & Withdraw'}
                        url={`/safes/${safeId}/withdraw`}
                        color={'blueish'}
                    />
                </RightSide>
            </HeaderContainer>
        </Container>
    )
}

export default SafeHeader

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
`

const HeaderContainer = styled.div`
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    @media (max-width: 767px) {
        flex-direction: column;
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
        &:first-child {
            margin-right: 10px;
        }
    }
    @media (max-width: 767px) {
        min-width: 100%;
        margin-top: 20px;
        justify-content: space-between;
        &:first-child {
            margin-right: 0;
        }
        a {
            min-width: 49%;
            display: flex;
            justify-content: center;
        }
    }
`

const SafeInfo = styled.div``

const UpperInfo = styled.div`
    font-size: ${(props) => props.theme.font.medium};
    font-weight: 600;
    min-width: 180px;
    span {
        color: ${(props) => props.theme.colors.blueish};
    }
    margin-top: 5px;
`
