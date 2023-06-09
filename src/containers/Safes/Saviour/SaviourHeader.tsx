import React, { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { SaviourData, useSaviourInfo } from '../../../hooks/useSaviour'
import AlertLabel from '../../../components/AlertLabel'
import { ArrowLeft } from 'react-feather'
import { ExternalLinkArrow } from '../../../GlobalStyle'

const SafeSaviour = ({
    isModifying,
    safeId,
    saviourData,
}: {
    isModifying: boolean
    safeId: string
    saviourData: SaviourData | undefined
}) => {
    const { t } = useTranslation()
    const [loaded, setLoaded] = useState(false)
    const history = useHistory()
    const { minSaviourBalance, isCurveSaviour } = useSaviourInfo()

    useEffect(() => {
        if (saviourData) {
            setLoaded(true)
        } else {
            setLoaded(false)
        }
    }, [saviourData])

    const saviourStatus = useMemo(() => {
        if (!saviourData) return 'none'

        if (
            Number(saviourData.saviourBalance) >= (minSaviourBalance as number)
        ) {
            return 'Protected'
        }
        return 'Unprotected'
    }, [saviourData, minSaviourBalance])

    return (
        <ContentContainer>
            <BackBtn onClick={() => history.goBack()}>
                <ArrowLeft size="16" /> Back
            </BackBtn>
            <Container>
                {!isModifying && loaded ? (
                    saviourData && saviourData.hasSaviour ? null : (
                        <ImageContainer>
                            <img
                                src={
                                    require('../../../assets/saviour.svg')
                                        .default
                                }
                                alt="saviour"
                            />
                        </ImageContainer>
                    )
                ) : null}

                <SaviourHeading
                    style={{
                        justifyContent:
                            isModifying ||
                            (saviourData && saviourData.hasSaviour)
                                ? 'space-between'
                                : 'center',
                    }}
                >
                    <Title>
                        {t('safe_saviour_title')} <span>#{safeId}</span>
                    </Title>
                    {saviourData && saviourData.hasSaviour ? (
                        <AlertLabel
                            isBlock={true}
                            text={`Status: ${saviourStatus}`}
                            type={
                                saviourStatus === 'Protected'
                                    ? 'success'
                                    : saviourStatus === 'none'
                                    ? 'dimmed'
                                    : 'danger'
                            }
                        />
                    ) : null}
                </SaviourHeading>
                <Description
                    dangerouslySetInnerHTML={{
                        __html:
                            isModifying ||
                            (saviourData && saviourData.hasSaviour)
                                ? t(
                                      isCurveSaviour
                                          ? 'curve_saviour_desc'
                                          : 'current_saviour_desc'
                                  )
                                : t('saviour_desc'),
                    }}
                />
            </Container>
        </ContentContainer>
    )
}

export default SafeSaviour

const ContentContainer = styled.div``

const ImageContainer = styled.div`
    text-align: center;
    margin: 3rem 0;
    img {
        max-width: 300px;
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
       img {
        width:100%;
       }
    `}
`

const Container = styled.div``

const Title = styled.div`
    font-size: 18px;
    line-height: 22px;
    letter-spacing: -0.33px;
    color: ${(props) => props.theme.colors.primary};
    font-weight: bold;
    span {
        color: ${(props) => props.theme.colors.blueish};
    }
`
const Description = styled.div`
    background: rgba(65, 193, 208, 0.4);
    border-radius: 25px;
    padding: 20px;
    margin-bottom: 20px;
    position: relative;
    margin-top: 10px;
    font-size: 14px;
    color: ${(props) => props.theme.colors.primary};
    line-height: 22px;
    a {
        ${ExternalLinkArrow}
    }
`

const SaviourHeading = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const BackBtn = styled.div`
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.colors.secondary};
    cursor: pointer;
    max-width: fit-content;
    svg {
        margin-right: 5px;
    }
`
