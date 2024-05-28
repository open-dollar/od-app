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
    max-width: 800px;
    min-width: 300px;
    margin-left: auto;
    margin-right: auto;
`
