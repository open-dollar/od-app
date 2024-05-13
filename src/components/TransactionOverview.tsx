import styled from 'styled-components'

interface Props {
    title: string
    description: string
    isChecked?: boolean
}

const TransactionOverview = ({ title, description, isChecked }: Props) => {
    return (
        <>
            <IconsHolder>
                <img width="75" height="75" src={require('../assets/od-logo-grey.svg').default} alt="" />
                {isChecked ? (
                    <>
                        <img className="sep" src={require('../assets/arrow.svg').default} alt="" />
                        <LogoIcon src={require('../assets/uniswap-icon.svg').default} />{' '}
                    </>
                ) : null}
            </IconsHolder>
            <Title>{title}</Title>
            <Description>{description}</Description>
        </>
    )
}

export default TransactionOverview

const IconsHolder = styled.div`
    display: flex;

    justify-content: center;

    .sep {
        margin: 0 33px;
    }
    svg {
        width: 50px;
        height: 50px;
    }
`

const Title = styled.div`
    line-height: 38.4px;
    font-weight: 700;
    font-family: 'Barlow', sans-serif;
    text-align: left;
    color: white;
    font-size: 28px;
    letter-spacing: -0.18px;
    margin-top: 20px;
`
const Description = styled.div`
    line-height: 27px;
    letter-spacing: -0.09px;
    font-family: 'Open Sans', sans-serif;
    font-size: 18px;
    color: white;
    text-align: left;
    margin-top: 4px;
    margin-bottom: 20px;
`

const LogoIcon = styled.img``
