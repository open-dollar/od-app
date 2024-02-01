import { useCallback } from 'react'
import styled from 'styled-components'
import { useTheme } from 'styled-components'
import { useTranslation } from 'react-i18next'

interface InputSliderProps {
    value: number
    onChange: (value: number) => void
    valueLabel?: string
    valueUnits?: string
    valueInfoLabel?: string
    step?: number
    min?: number
    max?: number
}

const Slider = ({
    value,
    valueLabel,
    valueUnits,
    valueInfoLabel,
    onChange,
    min = 0,
    step = 1,
    max = 100,
    ...rest
}: InputSliderProps) => {
    const { t } = useTranslation()
    const { colors } = useTheme()

    const changeCallback = useCallback(
        (e) => {
            onChange(parseInt(e.target.value))
        },
        [onChange]
    )

    const slidePercentage = ((value - min) / (max - min)) * 100

    return (
        <Container>
            <InnerFlexContainer style={{ flexDirection: 'column' }}>
                <SliderStepMarkersContainer>
                    {Array.from(Array(max).keys()).map((_, index) => (
                        <SliderTrackMarker
                            key={index}
                            style={{
                                backgroundColor: index >= Math.max(value, min) ? colors.placeholder : 'transparent',
                            }}
                        />
                    ))}
                </SliderStepMarkersContainer>
                <SliderTrack
                    style={{
                        background: `linear-gradient(to right, ${colors.blueish} ${slidePercentage}%, ${colors.colorPrimary} 0%)`,
                    }}
                >
                    <Input
                        {...rest}
                        type="range"
                        value={value}
                        onChange={changeCallback}
                        aria-labelledby="input slider"
                        step={step}
                        min={min}
                        max={max}
                    />
                </SliderTrack>
            </InnerFlexContainer>
            <InnerFlexContainer>
                {valueLabel && (
                    <LabelContainer>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <LabelText>{t(valueLabel)}</LabelText>
                            <ValueText>
                                {value} {valueUnits && <span>{t(valueUnits)}</span>}
                            </ValueText>
                        </div>
                        {valueInfoLabel && <LabelText>{t(valueInfoLabel)}</LabelText>}
                    </LabelContainer>
                )}
            </InnerFlexContainer>
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    background-color: ${(props) => props.theme.colors.placeholder};
    border: 1px solid ${(props) => props.theme.colors.border};
    padding: 15px 15px;
    border-radius: 10px;
`

const InnerFlexContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
`

const SliderStepMarkersContainer = styled.div`
    z-index: 1;
    position: relative;
    display: flex;
    justify-content: space-between;
    width: 95%;
    transform: translateY(5.5px);
`

const LabelContainer = styled.div`
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    line-height: 1;
`

const LabelText = styled.span`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.secondary};
`

const ValueText = styled.span`
    font-size: 15px;
    font-weight: 600;
    margin-left: 5px;
    color: ${({ theme }) => theme.colors.neutral};
`

const Input = styled.input`
    -webkit-appearance: none;
    background-color: transparent;
    border: none;
    width: 100%;
    outline: none;
    cursor: pointer;

    &:focus {
        outline: none;
    }

    &::-moz-focus-outer {
        border: 0;
    }

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 18px;
        width: 18px;
        background: ${({ theme }) => theme.colors.blueish};
        border-radius: 100%;
        border: 3px;
        border-style: solid;
        border-color: ${({ theme }) => theme.colors.colorPrimary};
        transform: translateY(-5.5px);
    }

    &::-moz-range-thumb {
        height: 14px;
        width: 14px;
        background: ${({ theme }) => theme.colors.blueish};
        border-radius: 100%;
        border: 3px;
        border-style: solid;
        border-color: ${({ theme }) => theme.colors.colorPrimary};
        transform: translateY(-35%)
    }

    &::-ms-thumb {
        height: 18px;
        width: 18px;
        background-color: ${({ theme }) => theme.colors.blueish};
        border-radius: 100%;
        border: 3px;
        border-style: solid;
        border-color: ${({ theme }) => theme.colors.colorPrimary};
        transform: translateY(-35%);
    }

    &::-webkit-slider-runnable-track {
        -webkit-appearance: none;
    }

    &::-moz-range-track {
        -webkit-appearance: none;
    }

    &::-ms-track {
        -webkit-appearance: none;
    }
`

const SliderTrack = styled.div`
    position: relative;
    height: 7px;
    width: 100%;
    border-radius: 10px;
`

const SliderTrackMarker = styled.div`
    width: 3.5px;
    height: 3.5px;
    border-radius: 100%;
`

export default Slider
