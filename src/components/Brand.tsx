import styled from 'styled-components'
import Logo from '../assets/od-full-logo.svg'

interface Props {
    height?: number
}

const Brand = ({ height }: Props) => {
    return (
        <Container>
            <a href={'/'}>
                <img src={Logo} height={'27px'} width={'148px'} alt="OD" />
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
            &.small {
                width: 50px;
                height: 50px;
            }
        }
    }
`
