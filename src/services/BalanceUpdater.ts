import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useActiveWeb3React } from '../hooks'
import useDebounce from '../hooks/useDebounce'
import store, { useStoreState } from '../store'

const ERC20_ABI = ['function balanceOf(address) view returns (uint256)']

export default function ApplicationUpdater(): null {
    const { provider, chainId, account } = useActiveWeb3React()
    const { connectWalletModel: connectedWalletState } = useStoreState((state) => state)
    const { blockNumber, tokensData } = connectedWalletState

    const [state, setState] = useState({
        chainId,
        balance: 0,
        collateralBalances: {},
    })

    // attach/detach listeners
    useEffect(() => {
        const getBalances = async () => {
            if (!chainId || !account || !provider) return undefined

            try {
                const ethBalance = ethers.utils.formatEther(await provider.getBalance(account))
                setState((state) => ({ ...state, balance: Number(ethBalance) }))

                if (tokensData) {
                    const balances = await Promise.all(
                        Object.values(tokensData).map(async (tokenData) => {
                            const { address, decimals, symbol } = tokenData;
                
                            const tokenContract = new ethers.Contract(address, ERC20_ABI, provider);
                
                            const balance = await tokenContract.balanceOf(account);
                            const formattedBalance = ethers.utils.formatUnits(balance, decimals);
                
                            return [symbol, formattedBalance]
                        })
                    );

                    const collateralBalances = balances.reduce((acc, [symbol, balance]) => {
                        acc[symbol] = balance;
                        return acc;
                    }, {} as Record<string, string>);

                    setState((state) => ({ ...state, collateralBalances }))
                }
            } catch (e) {
                console.error(`Failed to fetch balance for chainId: ${chainId}`, e)
            }
        }

        getBalances()
    }, [chainId, provider, account, blockNumber, tokensData])

    const debouncedState = useDebounce(state, 100)

    useEffect(() => {
        if (!debouncedState.chainId || !debouncedState.balance) return
        store.dispatch.connectWalletModel.updateEthBalance({
            chainId: debouncedState.chainId,
            balance: debouncedState.balance,
        })

        if (debouncedState.collateralBalances) {
            store.dispatch.connectWalletModel.updateCollateralBalances({
                chainId: debouncedState.chainId,
                balances: debouncedState.collateralBalances,
            })
        }
    }, [debouncedState.balance, debouncedState.chainId, debouncedState.collateralBalances])

    return null
}
