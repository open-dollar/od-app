import React from 'react'
import styled from 'styled-components'
import splashImage from '~/assets/404.webp'
import Brand from '~/components/Brand'

interface State {
    error: string | null
    errorInfo: any
}

interface Props {
    children?: any
}

const SimpleNavbar = () => {
    return (
        <SimpleNavbarContainer>
            <Left>
                <Brand />
            </Left>
        </SimpleNavbarContainer>
    )
}

class ErrorBoundary extends React.Component<Props, State> {
    state: State = { error: null, errorInfo: null }

    componentDidCatch(error: any, errorInfo: any) {
        this.setState({
            error: error,
            errorInfo: errorInfo,
        })
    }

    render() {
        const { children } = this.props
        if (this.state.errorInfo) {
            return (
                <>
                    <SimpleNavbar />
                    <Container>
                        <CenterBox>
                            <Text>{this.state.error && this.state.error.toString()}</Text>
                            <br />
                            <Details>
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo.componentStack}
                            </Details>
                        </CenterBox>
                    </Container>
                </>
            )
        }
        return children
    }
}

export default ErrorBoundary

const Container = styled.div`
    background-image: url(${splashImage});
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    height: 100vh;
    width: 100%;
    position: relative;
`

const CenterBox = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0);
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`

const Details = styled.details`
    white-space: pre-wrap;
    max-height: 300px;
    overflow-y: auto;
    font-size: 24px;
    line-height: 24px;
    font-weight: 500;
    @media (max-width: 767px) {
        font-size: 12px;
        line-height: 12px;
    }
`

const Text = styled.p`
    margin: 0;
    font-size: 24px;
    line-height: 24px;
    font-weight: 500;
    @media (max-width: 767px) {
        font-size: 12px;
        line-height: 12px;
    }
`

const SimpleNavbarContainer = styled.div`
    display: flex;
    height: 68px;
    align-items: center;
    justify-content: space-between;
    padding: 40px 40px 0 40px;
    position: relative;
    z-index: 5;
`

const Left = styled.div`
    display: flex;
    align-items: center;
`
