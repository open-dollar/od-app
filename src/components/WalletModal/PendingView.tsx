// Copyright (C) 2020  Uniswap
// https://github.com/Uniswap/uniswap-interface

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
import { AbstractConnector } from '@web3-react/abstract-connector'
import React from 'react'
import styled from 'styled-components'
import Option from './Option'
import { SUPPORTED_WALLETS } from '../../utils/constants'
import { injected } from '../../connectors'
import Loader from '../Loader'
import { useTranslation } from 'react-i18next'

export default function PendingView({
    connector,
    error = false,
    setPendingError,
    tryActivation,
}: {
    connector?: AbstractConnector
    error?: boolean
    setPendingError: (error: boolean) => void
    tryActivation: (connector: AbstractConnector) => void
}) {
    const isMetamask = window?.ethereum?.isMetaMask
    const { t } = useTranslation()
    return (
        <PendingSection>
            <LoadingMessage error={error}>
                <LoadingWrapper>
                    {error ? (
                        <ErrorGroup>
                            <div>{t('error_connecting')}</div>
                            <ErrorButton
                                onClick={() => {
                                    setPendingError(false)
                                    connector && tryActivation(connector)
                                }}
                            >
                                {t('try_again')}
                            </ErrorButton>
                        </ErrorGroup>
                    ) : (
                        <>
                            <StyledLoader />
                            {t('initializing')}
                        </>
                    )}
                </LoadingWrapper>
            </LoadingMessage>
            {Object.keys(SUPPORTED_WALLETS).map((key) => {
                const option = SUPPORTED_WALLETS[key]
                if (option.connector === connector) {
                    if (option.connector === injected) {
                        if (isMetamask && option.name !== 'MetaMask') {
                            return null
                        }
                        if (!isMetamask && option.name === 'MetaMask') {
                            return null
                        }
                    }
                    return (
                        <Option
                            id={`connect-${key}`}
                            key={key}
                            clickable={false}
                            color={option.color}
                            header={option.name}
                            subheader={option.description}
                            icon={
                                require(`../../assets/connectors/${option.iconName}`)
                                    .default
                            }
                        />
                    )
                }
                return null
            })}
        </PendingSection>
    )
}

const PendingSection = styled.div`
    align-items: center;
    justify-content: center;
    width: 100%;
    & > * {
        width: 100%;
    }
`

const StyledLoader = styled(Loader)`
    margin-right: 1rem;
`

const LoadingMessage = styled.div<{ error?: boolean }>`
    align-items: center;
    border-radius: 12px;
    margin-bottom: 20px;
    color: ${(props) => props.theme.colors.neutral};
    border: 1px solid
        ${({ theme, error }) =>
            error ? theme.colors.dangerColor : theme.colors.border};

    & > * {
        padding: 1rem;
    }
`

const ErrorGroup = styled.div`
    align-items: center;
    display: flex;
    color: red;
`

const ErrorButton = styled.div`
    border-radius: 8px;
    font-size: 12px;
    color: ${(props) => props.theme.colors.neutral};
    background-color: ${(props) => props.theme.colors.placeholder};
    margin-left: 1rem;
    padding: 0.5rem;
    font-weight: 600;
    user-select: none;
    cursor: pointer;
`

const LoadingWrapper = styled.div`
    align-items: center;
    justify-content: center;
    display: flex;
`
