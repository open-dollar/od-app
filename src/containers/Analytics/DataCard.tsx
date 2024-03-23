import { Info } from 'react-feather'
import styled from 'styled-components'

import { getTokenLogo } from '~/utils'

const images: { [key: string]: string } = {
    ETH: require('../../assets/eth-icon.svg').default,
    OD: getTokenLogo('OD'),
    NFTS: require('../../assets/nfts-icon.svg').default,
}

export interface DataCardProps {
    image?: string
    title: string
    value: string
    description?: string
    children?: React.ReactNode
}

const DataCard = ({ title, image, value, description, children }: DataCardProps) => {
    return (
        <Block>
            {description && (
                <InfoIcon data-tooltip-id="analitics" data-tooltip-content={description}>
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
        color: ${(props) => props.theme.colors.blueish};
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
    text-align: center;
    color: ${(props) => props.theme.colors.customSecondary};
`

const DataValue = styled.div`
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    line-height: 28.8px;
`
