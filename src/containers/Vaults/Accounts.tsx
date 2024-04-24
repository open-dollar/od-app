import styled from 'styled-components'
import Steps from '../../components/Steps'

const Accounts = () => {
    return (
        <Container>
            <Content>
                <Steps />
            </Content>
        </Container>
    )
}

export default Accounts

const Container = styled.div`
    padding: 30px 20px;
`

const Content = styled.div`
    max-width: 100%;
    margin: 0 auto;
`
