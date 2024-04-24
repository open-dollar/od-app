import styled from 'styled-components'
import { useStoreState } from '~/store'
import DarkFullLogo from '~/assets/od-full-logo-dark.svg'
import LightFullLogo from '~/assets/od-full-logo-light.svg'
import { Link } from 'react-router-dom'

const Brand = () => {
    const isLightTheme = useStoreState((state) => state.settingsModel.isLightTheme)

    const LogoComponent = isLightTheme ? LightFullLogo : DarkFullLogo

    return (
        <Container>
            <Link to="/">
                <img src={LogoComponent} alt="OD" />
            </Link>
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
