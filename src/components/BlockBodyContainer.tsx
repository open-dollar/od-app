import React from 'react'
import styled from 'styled-components'

const BlockBodyContainer = () => {
    return <Container />
}

export default BlockBodyContainer

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1000;
    background-color: rgba(35, 37, 39, 0.75);
    -webkit-tap-highlight-color: transparent;
`
