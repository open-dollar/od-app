import React from 'react'
import styled from 'styled-components'
interface Props {
    children: React.ReactNode
}

const GridContainer = ({ children }: Props) => {
    return (
        <Container>
            <InnerContent>{children}</InnerContent>
        </Container>
    )
}

export default GridContainer

const Container = styled.div`
    padding-bottom: 20px;
    @media (max-width: ${(props) => props.theme.global.gridMaxWidth}) {
        padding: 0 20px 20px 20px;
    }
`
const InnerContent = styled.div`
    max-width: ${(props) => props.theme.global.gridMaxWidth};
    width: 100%;
    margin: 0 auto;
`
