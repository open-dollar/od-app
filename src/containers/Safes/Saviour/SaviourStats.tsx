import React, { useEffect, useState } from 'react'
import { useSaviourInfo } from '../../../hooks/useSaviour'
import { useStoreActions } from '../../../store'
import styled from 'styled-components'
import { formatNumber } from '../../../utils/helper'
import numeral from 'numeral'
import { Info } from 'react-feather'
import ReactTooltip from 'react-tooltip'
import Slider from '../../../components/Slider'

export const MIN_SAVIOUR_CRATIO = 175

const SaviourStats = () => {
    const [showSlider, setShowSlider] = useState(false)
    const [sliderVal, setSliderVal] = useState<number>(0)

    const {
        saviourData,
        saviourState: { targetedCRatio, saviourType },
        stats,
        minSaviourBalance,
        mySaviourBalance,
    } = useSaviourInfo()
    const { safeModel: safeActions } = useStoreActions((state) => state)

    const returnFiatValue = (value: string, price: number) => {
        if (!value || !price) return '0.00'
        return formatNumber(
            numeral(value).multiply(price).value().toString(),
            2
        )
    }

    const handleSliderChange = (value: number | readonly number[]) => {
        setSliderVal(value as number)
        safeActions.setTargetedCRatio(value as number)
    }

    useEffect(() => {
        if (targetedCRatio) {
            setSliderVal(targetedCRatio)
        } else {
            if (saviourData) {
                const CRatio = saviourData.hasSaviour
                    ? saviourData.saviourRescueRatio
                    : saviourData.minCollateralRatio

                setSliderVal(CRatio)
                safeActions.setTargetedCRatio(CRatio)
            } else {
                setSliderVal(MIN_SAVIOUR_CRATIO)
            }
        }
    }, [safeActions, saviourData, targetedCRatio])

    return (
        <Container>
            <Flex>
                <Left>
                    <Inner className="main">
                        <Main>
                            <MainLabel>
                                <InfoIcon data-tip={stats.data[0].tip}>
                                    <Info size="16" />
                                </InfoIcon>{' '}
                                {stats.data[0].label}
                            </MainLabel>
                            <MainValue>{`${stats.data[0].value}`}</MainValue>
                            <MainChange>
                                {`$${
                                    saviourType === 'uniswap'
                                        ? returnFiatValue(
                                              minSaviourBalance as string,
                                              saviourData?.uniPoolPrice as number
                                          )
                                        : minSaviourBalance
                                }
                                `}
                            </MainChange>
                        </Main>

                        <Main className="mid">
                            <MainLabel>
                                <InfoIcon data-tip={stats.data[1].tip}>
                                    <Info size="16" />
                                </InfoIcon>{' '}
                                {stats.data[1].label}
                            </MainLabel>
                            <MainValue> {stats.data[1].value}</MainValue>
                            <MainChange></MainChange>
                        </Main>

                        <Main>
                            <MainLabel>
                                <InfoIcon data-tip={stats.data[1].tip}>
                                    <Info size="16" />
                                </InfoIcon>{' '}
                                {stats.data[2].label}
                            </MainLabel>
                            <MainValue>{stats.data[2].value}</MainValue>
                            <MainChange></MainChange>
                        </Main>
                    </Inner>
                </Left>

                <Right>
                    <Inner
                        className={`main ${
                            saviourType === 'uniswap' ? '' : 'isCurve'
                        }`}
                    >
                        <Main>
                            <MainLabel> {stats.info[0].label}</MainLabel>
                            <MainValue>{stats.info[0].value}</MainValue>
                            <MainChange>
                                {`$${
                                    saviourType === 'uniswap'
                                        ? returnFiatValue(
                                              mySaviourBalance as string,
                                              saviourData?.uniPoolPrice as number
                                          )
                                        : Number(mySaviourBalance) > 0
                                        ? mySaviourBalance
                                        : '0'
                                }`}
                            </MainChange>
                        </Main>

                        {saviourType === 'uniswap' ? (
                            <Main className="mids">
                                <MainLabel>
                                    <InfoIcon data-tip={stats.info[1].tip}>
                                        <Info size="16" />
                                    </InfoIcon>
                                    {stats.info[1].label}
                                </MainLabel>
                                <MainValue>
                                    <FlexValue>
                                        {stats.info[1].value}
                                        <span
                                            onClick={() =>
                                                setShowSlider(!showSlider)
                                            }
                                        >
                                            {showSlider ? 'Confirm' : 'Edit'}
                                        </span>
                                    </FlexValue>
                                    {showSlider ? (
                                        <SliderContainer>
                                            <Slider
                                                value={sliderVal}
                                                onChange={handleSliderChange}
                                                min={
                                                    saviourData?.minCollateralRatio ||
                                                    MIN_SAVIOUR_CRATIO
                                                }
                                                max={300}
                                                size={15}
                                            />
                                        </SliderContainer>
                                    ) : null}
                                </MainValue>
                            </Main>
                        ) : null}

                        <Main
                            style={{
                                marginTop:
                                    saviourType === 'curve' ? '30px' : '0',
                            }}
                        >
                            <MainLabel>{stats.info[2].label}</MainLabel>
                            <MainValue className="lower-size">
                                {stats.info[2].value}
                            </MainValue>
                        </Main>
                    </Inner>
                </Right>
            </Flex>
            <ReactTooltip multiline type="light" data-effect="solid" />
        </Container>
    )
}

export default SaviourStats

const Container = styled.div``

const Flex = styled.div`
    display: flex;
    @media (max-width: 767px) {
        flex-direction: column;
    }
`
const Inner = styled.div`
    background: ${(props) => props.theme.colors.colorSecondary};
    padding: 20px;
    border-radius: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &.main {
        padding: 30px;
    }
    &.isCurve {
        justify-content: flex-start;
    }
`

const Left = styled.div`
    flex: 0 0 50%;
    padding-right: 10px;
    margin-top: 20px;
    @media (max-width: 767px) {
        flex: 0 0 100%;
        padding-right: 0;
    }
`
const Right = styled.div`
    flex: 0 0 50%;
    padding-left: 10px;
    margin-top: 20px;
    @media (max-width: 767px) {
        flex: 0 0 100%;
        padding-left: 0;
    }
`

const Main = styled.div`
    &.mid {
        margin: 30px 0;
    }
`

const MainLabel = styled.div`
    font-size: ${(props) => props.theme.font.small};
    color: ${(props) => props.theme.colors.secondary};
    display: flex;
    align-items: center;
`

const MainValue = styled.div`
    font-size: 23px;
    color: ${(props) => props.theme.colors.primary};
    font-family: 'Montserrat', sans-serif;
    margin: 2px 0;
    span {
        font-size: ${(props) => props.theme.font.small};
    }
`

const MainChange = styled.div`
    font-size: 13px;
    color: ${(props) => props.theme.colors.customSecondary};
    span {
        &.green,
        &.low {
            color: ${(props) => props.theme.colors.blueish};
        }
        &.yellow {
            color: ${(props) => props.theme.colors.yellowish};
        }
        &.dimmed {
            color: ${(props) => props.theme.colors.secondary};
        }
        &.medium {
            color: ${(props) => props.theme.colors.yellowish};
        }
        &.high {
            color: ${(props) => props.theme.colors.dangerColor};
        }
    }
`

const InfoIcon = styled.div`
    cursor: pointer;
    svg {
        fill: ${(props) => props.theme.colors.secondary};
        color: ${(props) => props.theme.colors.foreground};
        position: relative;
        top: 2px;
        margin-right: 5px;
    }
`

const SliderContainer = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;
    ${({ theme }) => theme.mediaWidth.upToSmall`
       min-width:100%;
       margin-bottom:10px;
    `}
`

const FlexValue = styled.div`
    display: flex;
    align-items: center;

    span {
        cursor: pointer;
        margin-left: 10px;
        color: ${(props) => props.theme.colors.blueish};
    }
`
