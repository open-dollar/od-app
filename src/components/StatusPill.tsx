import styled from 'styled-components'
import { Icon } from 'react-feather'

interface StatusPillProps {
    status: 'enabled' | 'attention' | 'disabled'
    text: string
    icon?: Icon
}

const StatusPill = ({ status, text, icon }: StatusPillProps) => {
    const highlightColorMapping = {
        enabled: '#459D00',
        attention: '#E39806',
        disabled: '#FF3232',
    }

    const highlightColor = highlightColorMapping[status]

    return (
        <Container style={{ borderColor: highlightColor }}>
            <IconContainer>{icon ? { icon } : <Circle style={{ backgroundColor: highlightColor }} />}</IconContainer>
            <Text style={{ color: highlightColor }}>{text}</Text>
        </Container>
    )
}

export default StatusPill

const Container = styled.div`
    display: inline-flex;
    align-items: center;
    border: 1px solid;
    border-radius: 50px;
    padding: 4px 8px;
`

const IconContainer = styled.div`
    margin-right: 4px;
`

const Circle = styled.div`
    width: 6px;
    height: 6px;
    border-radius: 50%;
`

const Text = styled.p`
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
`
