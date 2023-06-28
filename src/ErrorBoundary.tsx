import React from 'react'
import styled from 'styled-components'

interface State {
    error: string | null
    errorInfo: any
}

interface Props {
    children?: any
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
                <Container>
                    <Content>
                        <img src={require('./assets/error.svg').default} alt="" />
                        <h2>Something went wrong.</h2>
                        <Details>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo.componentStack}
                        </Details>
                    </Content>
                </Container>
            )
        }
        return children
    }
}

export default ErrorBoundary

const Container = styled.div`
    width: 100%;
    height: 100%;
    background: #1e1a3a;
    position: relative;
    height: 100vh;
    color: #fff;
    padding: 30px;
    display: flex;
    align-items: center;
`

const Content = styled.div`
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
    img {
        margin-bottom: 30px;
        width: 300px;
    }
    h1 {
        font-weight: normal;
    }
`

const Details = styled.details`
    white-space: 'pre-wrap';
`
