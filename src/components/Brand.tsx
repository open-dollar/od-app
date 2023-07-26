import styled from 'styled-components'
import Logo from '../assets/od-full-logo.svg'

interface Props {
    height?: number
}

const Brand = ({ height }: Props) => {
    return (
        <Container>
            <a href={'/'}>
                <img src={Logo} alt="HAI" height={'25px'} width={'25px'} />
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
            width: 75px;
            &.small {
                width: 50px;
                height: 50px;
            }
            ${({ theme }) => theme.mediaWidth.upToSmall`
        width: 50px;
        height: 50px;
      }
      `}
        }
    }
`
