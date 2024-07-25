import styled from 'styled-components'
import BridgeFundsForm from './BridgeFundsForm'
import MetaTags from '~/components/MetaTags'
import metaInfo from '~/utils/metaInfo'

const Bridge = () => {
    return (
        <>
            <MetaTags page={metaInfo.bridge} />
            <Container id="app-page">
                <BridgeFundsForm />
            </Container>
        </>
    )
}

export default Bridge

const Container = styled.div`
    max-width: 800px;
    min-width: 300px;
    margin-left: auto;
    margin-right: auto;
`
