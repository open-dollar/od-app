import styled from 'styled-components'
interface Props {
    header?: boolean
}
const BlockBodyContainer: React.FC<Props> = ({ header }) => {
    return <Container header={!!header} />
}

export default BlockBodyContainer

const Container = styled.div<{ header: boolean }>`
    position: ${(props) => (props.header ? 'absolute' : 'fixed')};
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1000;
    background-color: rgba(35, 37, 39, 0.75);
    -webkit-tap-highlight-color: transparent;
`
