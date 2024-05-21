import styled from 'styled-components'

const ToastBannerNetwork = () => {
    return (
        <Container>
            <Text>
                NOTE: This UI is provided as a convenience for HAI users. Open Dollar makes no guarantees of service.
            </Text>
        </Container>
    )
}

export default ToastBannerNetwork

const Container = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 15px;
    background-color: #1a74ec;
    svg {
        margin-right: 15px;
    }
`

const Text = styled.div<{ color?: string }>`
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => (props.color ? props.color : props.theme.colors.neutral)};
`
