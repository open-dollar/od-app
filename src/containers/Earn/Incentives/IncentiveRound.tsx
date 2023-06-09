import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Info as InfoIcon } from 'react-feather'
import Arrow from '../../../components/Icons/Arrow'
import { ExternalLinkArrow } from '../../../GlobalStyle'
import { Round } from '../../../utils/interfaces'
import ReactTooltip from 'react-tooltip'

const returnDate = (date: string) =>
    dayjs(date).isValid() ? dayjs(date).format('MMM D, YYYY h:mm A') : date

interface Props {
    round: Round
    collapsed: boolean
}
const IncentiveRound = ({ round, collapsed }: Props) => {
    const { t } = useTranslation()
    const [isCollapsed, setIsCollapsed] = useState(collapsed)

    return (
        <IncentiveContainer>
            <Header onClick={() => setIsCollapsed(!isCollapsed)}>
                <LeftBlock>
                    <MainBlock>
                        <img
                            src={
                                require('../../../assets/incentive.svg').default
                            }
                            alt="incentive"
                        />
                        {round.name}
                    </MainBlock>
                </LeftBlock>
                {/* <RightBlock>
                    <Info>
                        <InfoCol>
                            <InfoLabel>Snapshot Date</InfoLabel>
                            <InfoValue>
                                {returnDate(round.snapshotDate)}
                            </InfoValue>
                        </InfoCol>
                        <InfoCol>
                            <InfoLabel>Distribution Date</InfoLabel>
                            <InfoValue>
                                {returnDate(round.distributionDate)}
                            </InfoValue>
                        </InfoCol>
                    </Info>
                </RightBlock> */}
            </Header>

            {isCollapsed ? null : (
                <Distros>
                    {round.distros.length > 0 ? (
                        round.distros.map((distro) => {
                            return (
                                <Distro
                                    key={
                                        round.name + distro.name + Math.random()
                                    }
                                >
                                    <Row>
                                        <LeftBlock>
                                            <DistroData>
                                                <img
                                                    style={{
                                                        borderRadius:
                                                            distro.name
                                                                .toLowerCase()
                                                                .includes(
                                                                    'flx/eth'
                                                                )
                                                                ? '0'
                                                                : '50%',
                                                    }}
                                                    src={distro.image}
                                                    alt=""
                                                />{' '}
                                                {distro.name}
                                            </DistroData>
                                            <DistroDesc
                                                dangerouslySetInnerHTML={{
                                                    __html: distro.description,
                                                }}
                                            />
                                        </LeftBlock>
                                        <RightBlock>
                                            <Info>
                                                {/* <InfoCol>
                                                    <InfoLabel>
                                                        Start Date
                                                    </InfoLabel>
                                                    <InfoValue>
                                                        {returnDate(
                                                            distro.from
                                                        )}
                                                    </InfoValue>
                                                </InfoCol> */}
                                                <InfoCol>
                                                    <InfoLabel>
                                                        End Date
                                                    </InfoLabel>
                                                    <InfoValue>
                                                        {returnDate(
                                                            distro.until
                                                        )}
                                                    </InfoValue>
                                                </InfoCol>
                                                <InfoCol>
                                                    <InfoLabel>
                                                        Amount
                                                    </InfoLabel>
                                                    <InfoValue>
                                                        {distro.amount}
                                                    </InfoValue>
                                                </InfoCol>

                                                {distro.apy ? (
                                                    <InfoCol
                                                        className="apy-box"
                                                        onMouseEnter={() =>
                                                            ReactTooltip.rebuild()
                                                        }
                                                    >
                                                        <IconBox
                                                            data-tip={
                                                                distro.apy_description
                                                            }
                                                        >
                                                            <InfoIcon size="16" />
                                                        </IconBox>
                                                        <InfoLabel>
                                                            {distro.apy_title}
                                                        </InfoLabel>
                                                        <InfoValue>
                                                            {distro.apy}
                                                        </InfoValue>
                                                    </InfoCol>
                                                ) : (
                                                    <InfoCol className="apy-box blank" />
                                                )}
                                            </Info>
                                        </RightBlock>
                                    </Row>

                                    <Extras>
                                        {distro.optional
                                            ? Object.keys(distro.optional)
                                                  .sort()
                                                  .map((key) => {
                                                      return (
                                                          <ExtraData
                                                              key={
                                                                  key +
                                                                  distro.name +
                                                                  Math.random()
                                                              }
                                                          >
                                                              <b>{key}</b>:{' '}
                                                              {
                                                                  distro
                                                                      .optional[
                                                                      key
                                                                  ]
                                                              }
                                                          </ExtraData>
                                                      )
                                                  })
                                            : null}
                                    </Extras>

                                    <BtnContainer>
                                        <ExtLink
                                            href={distro.link}
                                            target="_blank"
                                        >
                                            Go to App <Arrow />
                                        </ExtLink>
                                    </BtnContainer>
                                </Distro>
                            )
                        })
                    ) : (
                        <Empty>{t('no_distros')}</Empty>
                    )}
                    {round.starMessage ? (
                        <StarMessage>
                            <img
                                src={
                                    require('../../../assets/siren.svg').default
                                }
                                alt="siren"
                            />
                            {round.starMessage}
                        </StarMessage>
                    ) : null}
                </Distros>
            )}
            <ReactTooltip multiline type="light" data-effect="solid" />
        </IncentiveContainer>
    )
}

export default IncentiveRound

const IncentiveContainer = styled.div`
    margin-bottom: 15px;
`
const Header = styled.div`
    font-size: ${(props) => props.theme.font.medium};
    font-weight: 900;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items:flex-start;
  `}
`

const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items:flex-start;
  `}
`

const LeftBlock = styled.div``

const RightBlock = styled.div`
    ${({ theme }) => theme.mediaWidth.upToSmall`
      flex: 0 0 100%;
      min-width:100%;
      flex-direction:column;
      margin-top:10px;
  `}
`

const MainBlock = styled.div`
    display: flex;
    align-items: center;
    font-size: ${(props) => props.theme.font.medium};
    img {
        margin-right: 10px;
    }
`

const Info = styled.div`
    display: flex;
    align-items: center;
    ${({ theme }) => theme.mediaWidth.upToSmall`
      flex-direction:column;
  `}
`

const InfoCol = styled.div`
    font-size: ${(props) => props.theme.font.small};
    min-width: 150px;

    &.apy-box {
        position: relative;
        border: 1px solid ${(props) => props.theme.colors.alertBorder};
        background: ${(props) => props.theme.colors.alertBackground};
        color: ${(props) => props.theme.colors.alertColor};
        padding: 8px;
        height: fit-content;
        text-align: center;
        font-size: ${(props) => props.theme.font.small};
        border-radius: ${(props) => props.theme.global.borderRadius};
        letter-spacing: -0.09px;
        min-width: 120px;
        flex: 0 0 120px;
        > div {
            color: inherit;
            font-weight: bold;
        }
        ${({ theme }) => theme.mediaWidth.upToSmall`
      flex: 0 0 100%;
      min-width:100%;
      display:flex;
      align-items:center;
      justify-content:space-between;
      margin-left:0;
      margin-top:5px;
      >div:last-child {
          padding-right:20px;
      }
    
    `}
    }
    &.blank {
        background: transparent;
        border: 0;
        padding: 0;
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
      flex: 0 0 100%;
      min-width:100%;
      display:flex;
      align-items:center;
      justify-content:space-between;
      margin-left:0;
      margin-top:5px;
    
  `}
`

const InfoLabel = styled.div`
    color: ${(props) => props.theme.colors.secondary};
    font-size: ${(props) => props.theme.font.extraSmall};
`
const InfoValue = styled.div`
    margin-top: 3px;
    color: ${(props) => props.theme.colors.primary};
    font-weight: normal;
    font-size: ${(props) => props.theme.font.extraSmall};
`

const Distros = styled.div`
    padding: 20px;
`
const Distro = styled.div`
    border-radius: 15px;
    border: 1px solid ${(props) => props.theme.colors.border};
    margin-bottom: 15px;
    background: ${(props) => props.theme.colors.colorPrimary};
    padding: 15px;
`

const Empty = styled.div`
    text-align: center;
    font-size: 14px;
`

const DistroData = styled.div`
    display: flex;
    align-items: center;

    img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 10px;
    }
`

const DistroDesc = styled.div`
    font-size: 14px;
    margin-top: 5px;
    a {
        ${ExternalLinkArrow}
    }
`

const Extras = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
`

const ExtraData = styled.div`
    font-size: 14px;
    margin-right: 20px;
    position: relative;
    padding-left: 15px;
    margin-top: 5px;
    &:before {
        top: 5px;
        left: 0px;
        position: absolute;
        content: '';
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: ${(props) => props.theme.colors.gradient};
        margin-right: 5px;
    }
`

const StarMessage = styled.div`
    display: flex;
    align-items: center;
    font-size: 13px;
    margin-top: 20px;
    img {
        margin-right: 5px;
        width: 17px;
    }
`

const BtnContainer = styled.div`
    text-align: right;
`

const ExtLink = styled.a`
    ${ExternalLinkArrow}
`

const IconBox = styled.div`
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
    svg {
        fill: ${(props) => props.theme.colors.alertColor};
        color: ${(props) => props.theme.colors.alertBorder};
    }
`
