import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AlertTriangle } from 'react-feather'
import styled from 'styled-components'
import { Round } from '../../../utils/interfaces'
import IncentiveRound from './IncentiveRound'

const Incentives = () => {
    const [incentives, setIncentives] = useState<Array<Round>>([])
    const [isFetching, setIsFetching] = useState(true)
    const [error, setError] = useState('')

    // fetching incentives rounds
    useEffect(() => {
        async function fetchIncentives() {
            try {
                setIsFetching(true)
                const res = await Axios.get(
                    `https://4svutwkz1c.execute-api.eu-west-2.amazonaws.com/v1/`
                )
                setIncentives(res.data.data.rounds)
                setIsFetching(false)
            } catch (error) {
                console.log(error)
                setIsFetching(false)
                setError('Something went wrong fetching incentives')
            }
        }
        fetchIncentives()
    }, [])

    return (
        <Container>
            <Inner>
                {isFetching ? (
                    <NoData>{'Loading incentives rounds...'}</NoData>
                ) : error ? (
                    <NoData>
                        <AlertTriangle size="16" /> {error}
                    </NoData>
                ) : incentives.length > 0 ? (
                    incentives.map((round, index: number) => {
                        return (
                            <IncentiveRound
                                round={round}
                                collapsed={index !== 0}
                                key={round.name + round.number}
                            />
                        )
                    })
                ) : (
                    <NoData>
                        {'No incentives rounds available at this moment'}
                    </NoData>
                )}
            </Inner>
        </Container>
    )
}

export default Incentives

const Container = styled.div`
    max-width: 1024px;
    margin: 80px auto;
    padding: 0 15px;
    @media (max-width: 767px) {
        margin: 50px auto;
    }
`
const Inner = styled.div`
    padding: 15px;
    border-radius: 15px;
    background: ${(props) => props.theme.colors.colorSecondary};
`

const NoData = styled.div`
    border-radius: 15px;
    margin-bottom: 15px;
    background: ${(props) => props.theme.colors.background};
    padding: 2rem 20px;
    text-align: center;
    font-size: ${(props) => props.theme.font.small};
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
        margin-right: 5px;
        color: ${(props) => props.theme.colors.dangerColor};
    }
`
