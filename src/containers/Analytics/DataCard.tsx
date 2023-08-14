import { Info } from 'react-feather'
import styled from 'styled-components'

import { TOKEN_LOGOS } from '~/utils'

const images: { [key: string]: string } = {
    ETH: require('../../assets/eth-icon.svg').default,
    OD: TOKEN_LOGOS['OD'],
    NFTS: require('../../assets/nfts-icon.svg').default

}

export interface DataCardProps {
    image?: string
    title: string
    value: string
    description?: string
    children?: React.ReactChildren | React.ReactChild
}

const DataCard = ({ title, image, value, description, children }: DataCardProps) => {
    return (
        <Block>
            {description && (
                <InfoIcon data-tip={description}>
                    <Info size="20" />
                </InfoIcon>
            )}

            {image && <img src={images[`${image}`]} alt={image} width="50px" height="50px" />}

            <DataTitle>{title}</DataTitle>
            <DataValue>{value}</DataValue>
            {children}
        </Block>
    )
}

export default DataCard

const Block = styled.div`
    // display: flex;
    // flex-direction: column;
    // align-items: center;
    // justify-content: space-around;
    //
    // background: ${(props) => props.theme.colors.colorPrimary};
    // max-width: calc(100% / 3 - 50px);
    // min-width: 280px;
    // width: 100%;
    // min-height: 220px;
    // height: 100%;
    // margin: 10px;
    // flex-wrap: wrap;
    //
    // padding: 36px 0px;

    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 48px 0px;

    width: 100%;
    height: 100%;
    border-radius: 20px;
    background: ${(props) => props.theme.colors.colorPrimary};

    ${({ theme }) => theme.mediaWidth.upToSmall`
        max-width: 100%;
    `}

    & img {
        margin-bottom: 32px;
    }
`

export const InfoIcon = styled.div`
    cursor: pointer;
    position: absolute;
    right: 12px;
    top: 12px;
    svg {
        fill: ${(props) => props.theme.colors.foreground};
        color: ${(props) => props.theme.colors.secondary};
        position: relative;
        top: 2px;
        margin-right: 5px;
    }
`

const DataTitle = styled.div`
    font-size: ${(props) => props.theme.font.extraSmall};
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 8px;
    color: ${(props) => props.theme.colors.customSecondary};
`

const DataValue = styled.div`
    font-size: 24px;
    font-weight: 700;
`
