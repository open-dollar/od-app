// Adapted from Lyra Finance
// https://github.com/lyra-finance/interface

import { BigNumberish, BigNumber, FixedNumber } from '@ethersproject/bignumber'
import { Contract } from 'ethers'
import { Geb } from '@opendollar/sdk'
import { formatUnits } from 'ethers/lib/utils'

export const SECONDS_IN_YEAR = 31536000

export type CamelotMulticallRequest<C extends Contract = Contract, F extends keyof C['functions'] & string = string> = {
    contract: C
    function: F
    args: Parameters<C['functions'][F]>
}

type MulticallResponse<R extends CamelotMulticallRequest> = Awaited<
    ReturnType<R['contract']['functions'][R['function']]>
>

type MulticallResponses<Reqs extends CamelotMulticallRequest[]> = { [K in keyof Reqs]: MulticallResponse<Reqs[K]> }

export async function multicall<Reqs extends CamelotMulticallRequest[]>(
    geb: Geb,
    requests: Reqs
): Promise<{
    returnData: MulticallResponses<Reqs>
    blockNumber: number
}> {
    const multicall3Contract = geb.contracts.multicall
    const calls = requests.map((req) => ({
        target: req.contract.address,
        callData: req.contract.interface.encodeFunctionData(req.function, req.args),
    }))
    const { returnData, blockNumber } = await multicall3Contract.callStatic.aggregate(calls)
    const result = requests.map((req, idx) => {
        const contract = req.contract
        const result = contract.interface.decodeFunctionResult(req.function, returnData[idx])
        return result
    })
    return {
        returnData: result as MulticallResponses<Reqs>,
        blockNumber: blockNumber.toNumber(),
    }
}

export function fromBigNumber(number: BigNumber, decimals: number = 18): number {
    return parseFloat(formatUnits(number.toString(), decimals))
}