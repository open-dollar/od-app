import styled from 'styled-components'
import Loader from './Loader'
import TokenIcon from './TokenIcon'
import ArrowDown from './Icons/ArrowDown'

const DollarValueInner = ({ value, popup }: { value: number; popup: boolean }) => {
    return (
        <Container>
            <TokenIcon token="OD" width="22" height="22" />
            {value ? <span>{value}</span> : <Loader color="#0071E7" width="20px" />}
            <ArrowWrapper>
                <ArrowDown fill={popup ? '#1499DA' : '#00587E'} />
            </ArrowWrapper>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
`

const ArrowWrapper = styled.div`
    margin-left: 8px;
`

export default DollarValueInner
