import { useMemo } from 'react'
import { Interface } from '@ethersproject/abi'
import { getAddress } from '@ethersproject/address'
import ERC20ABI from '../abis/erc20.json'
import { Erc20Interface } from '../abis/Erc20'
import { useMultipleContractSingleData } from './Multicall'
import { TokenName, TOKENS, Tokens } from '../utils/tokens'
import useGeb from './useGeb'
import { ethers } from 'ethers'
import { isAddress } from '../utils/helper'
import store from '../store'
import { NETWORK_ID } from '../connectors'

export function useEthBalance() {
    return store.getState().connectWalletModel.ethBalance[NETWORK_ID].toString()
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
    address?: string,
    tokens: Tokens | undefined = TOKENS
): [Tokens, boolean] {
    const geb = useGeb()
    const ethBalance = useEthBalance()
    const validatedTokens: { name: string; address: string }[] | [] = useMemo(
        () =>
            geb
                ? Object.keys(tokens).map((t: string) => {
                      let address = ''

                      if (
                          tokens[t as TokenName].address &&
                          tokens[t as TokenName].address !== ''
                      ) {
                          address = tokens[t as TokenName].address
                      } else if (tokens[t as TokenName].gebName) {
                          address =
                              // @ts-ignore
                              geb.contracts[tokens[t].gebName].address
                      }
                      return { name: t, address }
                  })
                : [],
        [geb, tokens]
    )

    const validatedTokenAddresses = useMemo(
        () =>
            validatedTokens.map((vt) =>
                isAddress(vt.address) ? getAddress(vt.address) : undefined
            ),
        [validatedTokens]
    )

    const ERC20Interface = new Interface(ERC20ABI) as Erc20Interface
    const balances = useMultipleContractSingleData(
        validatedTokenAddresses,
        ERC20Interface,
        'balanceOf',
        [address],
        undefined,
        100_000
    )

    const anyLoading: boolean = useMemo(
        () => balances.some((callState) => callState.loading),
        [balances]
    )

    return [
        useMemo(
            () =>
                address && validatedTokens.length > 0
                    ? validatedTokens.reduce<Tokens>(
                          (memo: Tokens, token, i) => {
                              const value = balances?.[i]?.result?.[0]
                              const amount = value
                                  ? ethers.utils.formatEther(value)
                                  : undefined

                              memo[token.name as TokenName] = {
                                  ...TOKENS[token.name as TokenName],
                                  address: token.address,
                                  balance:
                                      token.name === 'eth'
                                          ? ethBalance
                                          : amount
                                          ? amount
                                          : '',
                              }

                              return memo
                          },
                          TOKENS
                      )
                    : TOKENS,
            [address, validatedTokens, balances, ethBalance]
        ),
        anyLoading,
    ]
}

export function useTokenBalances(
    address?: string,
    tokens: Tokens = TOKENS
): Tokens {
    return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}
