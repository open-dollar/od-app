import React from 'react'
import styled from 'styled-components'

const BlockedAddress = () => {
    return (
        <Container>
            <Box>Sorry, you cannot use the app!</Box>
        </Container>
    )
}

export default BlockedAddress

const Box = styled.div`
    background: ${(props) => props.theme.colors.colorSecondary};
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    margin-top: 100px;
`

const Container = styled.div`
    max-width: 880px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`
