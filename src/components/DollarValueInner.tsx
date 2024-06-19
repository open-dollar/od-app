import styled from 'styled-components'
import Loader from './Loader'
import TokenIcon from './TokenIcon'
import ArrowDown from './Icons/ArrowDown'

const DollarValueInner = ({ value, popup }: { value: string; popup: boolean }) => {
    return (
        <Container>
            <TokenIcon token="OD" width="22" height="22" />
            {value ? <span>{value}</span> : <Loader color="#0071E7" width="20px" />}
            <ArrowDown fill={popup ? '#1499DA' : '#00587E'} />
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    gap: 8px;
`

export default DollarValueInner
