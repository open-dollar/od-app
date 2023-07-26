import { Info } from 'react-feather'
import styled from 'styled-components'

import { TOKEN_LOGOS } from '~/utils'

export interface DataCardProps {
    image?: string
    title: string
    value: string
    description: string
    priceInUsd?: boolean
}

const DataCard = ({ title, image, value, description, priceInUsd }: DataCardProps) => {
    return (
        <Block>
            <InfoIcon data-tip={description}>
                <Info size="20" />
            </InfoIcon>
            {image && (
                <>
                    <img src={TOKEN_LOGOS[image]} alt={image} width="50px" height="50px" />
                    <DataTitle>{title}</DataTitle>
                </>
            )}

            {!image && <h1 className="text-egg font-semibold font-poppins text-3xl"> {title}</h1>}
            <DataValue>{value}</DataValue>
        </Block>
    )
}

export default DataCard

const Block = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    border-radius: 20px;
    background: ${(props) => props.theme.colors.colorSecondary};
    max-width: calc(100% / 2 - 50px);
    min-width: 280px;
    width: 100%;
    height: 220px;
    margin: 10px;
    flex-wrap: wrap;
    position: relative;
    padding: 36px 0px;
`

const InfoIcon = styled.div`
    cursor: pointer;
    position: absolute;
    right: 12px;
    top: 12px;
    svg {
        fill: ${(props) => props.theme.colors.secondary};
        color: ${(props) => props.theme.colors.foreground};
        position: relative;
        top: 2px;
        margin-right: 5px;
    }
`

const DataTitle = styled.h2`
    font-size: ${(props) => props.theme.font.medium};
    font-weight: 600;
    margin: 14px 0;
    color: ${(props) => props.theme.colors.customSecondary};
    font-size: ${(props) => props.theme.font.medium};
`

const DataValue = styled.h2`
    font-size: ${(props) => props.theme.font.extraLarge};
    font-weight: 600;
`
