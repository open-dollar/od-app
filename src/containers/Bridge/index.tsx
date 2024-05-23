import styled from 'styled-components'
import BridgeFundsForm from './BridgeFundsForm'

const Bridge = () => {
    return (
        <Container id="app-page">
            <BridgeFundsForm />
        </Container>
    )
}

export default Bridge

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`