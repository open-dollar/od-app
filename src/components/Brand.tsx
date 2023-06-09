import React from 'react'
import styled from 'styled-components'

interface Props {
    height?: number
}

const Brand = ({ height }: Props) => {
    const imgUrl = require(`../assets/brand-white.png`).default
    return (
        <Container>
            <a href={'/'}>
                <img src={imgUrl} alt="Reflexer Labs" />
            </a>
        </Container>
    )
}

export default Brand

const Container = styled.div`
    a {
        color: inherit;
        text-decoration: none;
        img {
            width: 160px;
            &.small {
                width: 105.14px;
                height: 25.49px;
            }
            ${({ theme }) => theme.mediaWidth.upToSmall`
        width: 105.14px;
        height: 25.49px;
      }
      `}
        }
    }
`
