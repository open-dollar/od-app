import styled from 'styled-components'

interface DepositDetailsProps {
    values: { title: string; content: React.ReactNode | string | number }[]
}

export const DepositDetailCard = ({ values }: DepositDetailsProps) => {
    return (
        <InformationCard>
            {values.map((value, index) => (
                <Container key={index}>
                    <InfoCardTitle>{value.title.toUpperCase()}</InfoCardTitle>
                    <DepositCardText>{value.content ? value.content : '-'}</DepositCardText>
                </Container>
            ))}
        </InformationCard>
    )
}

const Container = styled.div``

const InformationCard = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: ${(props) => props.theme.colors.colorPrimary};
    height: 224px;
    padding: 20px;
    border-radius: 8px;
`

const InfoCardTitle = styled.p`
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: ${(props) => props.theme.colors.secondary};
    margin-bottom: 4px;
`

export const DepositCardText = styled.span`
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    color: ${(props) => props.theme.colors.primary};
`

export const DepositCardSecondaryText = styled.span`
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    color: ${(props) => props.theme.colors.secondary};
`
