import { useMemo } from 'react'
import { Interface } from '@ethersproject/abi'
import { getAddress } from '@ethersproject/address'
import ERC20ABI from '../abis/erc20.json'
import { Erc20Interface } from '../abis/Erc20'
import { useMultipleContractSingleData } from './Multicall'
import useGeb from './useGeb'
import { ethers } from 'ethers'
import { isAddress } from '../utils/helper'
import store from '../store'
import { NETWORK_ID } from '../connectors'

export function useEthBalance() {
    return store.getState().connectWalletModel.ethBalance[NETWORK_ID].toString()
}
