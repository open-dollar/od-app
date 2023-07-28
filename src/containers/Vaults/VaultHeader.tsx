import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import styled from 'styled-components'

import LinkButton from '~/components/LinkButton'

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

    const handleBack = useCallback(() => {
        history.push(`/vaults`)
    }, [history])

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
`

const LeftSide = styled.div`
    display: flex;
    @media (max-width: 767px) {
        min-width: 100%;
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
