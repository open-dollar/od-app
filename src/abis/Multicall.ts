import { MulticallRequest } from '@reflexer-finance/geb-contract-base'
import { Provider, Listener } from '@ethersproject/providers'
import { BytesLike } from '@ethersproject/bytes'
import { BigNumberish } from '@ethersproject/bignumber'
import { BigNumber } from '@ethersproject/bignumber'
import { FunctionFragment, Result } from 'ethers/lib/utils'
import {
    BaseContract,
    ethers,
    Signer,
    CallOverrides,
    ContractTransaction,
    Overrides,
} from 'ethers'
import { TypedEvent, TypedEventFilter, TypedListener } from './common'

export type CallStruct = { target: string; callData: BytesLike }

export type CallStructOutput = [string, string] & {
    target: string
    callData: string
}

interface MulticallInterface extends ethers.utils.Interface {
    functions: {
        'getCurrentBlockTimestamp()': FunctionFragment
        'getEthBalance(address)': FunctionFragment
        'multicall(tuple[])': FunctionFragment
    }

    encodeFunctionData(
        functionFragment: 'getCurrentBlockTimestamp',
        values?: undefined
    ): string
    encodeFunctionData(
        functionFragment: 'getEthBalance',
        values: [string]
    ): string
    encodeFunctionData(
        functionFragment: 'multicall',
        values: [
            { target: string; gasLimit: BigNumberish; callData: BytesLike }[]
        ]
    ): string

    decodeFunctionResult(
        functionFragment: 'getCurrentBlockTimestamp',
        data: BytesLike
    ): Result
    decodeFunctionResult(
        functionFragment: 'getEthBalance',
        data: BytesLike
    ): Result
    decodeFunctionResult(functionFragment: 'multicall', data: BytesLike): Result

    events: {}
}

export declare class Multicall extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this
    attach(addressOrName: string): this
    deployed(): Promise<this>

    listeners<EventArgsArray extends Array<any>, EventArgsObject>(
        eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
    ): Array<TypedListener<EventArgsArray, EventArgsObject>>
    off<EventArgsArray extends Array<any>, EventArgsObject>(
        eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
        listener: TypedListener<EventArgsArray, EventArgsObject>
    ): this
    on<EventArgsArray extends Array<any>, EventArgsObject>(
        eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
        listener: TypedListener<EventArgsArray, EventArgsObject>
    ): this
    once<EventArgsArray extends Array<any>, EventArgsObject>(
        eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
        listener: TypedListener<EventArgsArray, EventArgsObject>
    ): this
    removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
        eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
        listener: TypedListener<EventArgsArray, EventArgsObject>
    ): this
    removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
        eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
    ): this

    listeners(eventName?: string): Array<Listener>
    off(eventName: string, listener: Listener): this
    on(eventName: string, listener: Listener): this
    once(eventName: string, listener: Listener): this
    removeListener(eventName: string, listener: Listener): this
    removeAllListeners(eventName?: string): this

    queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
        event: TypedEventFilter<EventArgsArray, EventArgsObject>,
        fromBlockOrBlockhash?: string | number | undefined,
        toBlock?: string | number | undefined
    ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>
    interface: MulticallInterface
    aggregate(
        calls: {
            target: string
            callData: BytesLike
        }[]
    ): Promise<{
        blockNumber: BigNumber
        returnData: string[]
    }>
    aggregate_readOnly(
        calls: {
            target: string
            callData: BytesLike
        }[]
    ): Promise<{
        blockNumber: BigNumber
        returnData: string[]
    }>
    aggregate_readOnly(
        calls: {
            target: string
            callData: BytesLike
        }[],
        multicall: true
    ): MulticallRequest<{
        blockNumber: BigNumber
        returnData: string[]
    }>
    getBlockHash(blockNumber: BigNumberish): Promise<string>
    getBlockHash(
        blockNumber: BigNumberish,
        multicall: true
    ): MulticallRequest<string>
    getCurrentBlockCoinbase(): Promise<string>
    getCurrentBlockCoinbase(multicall: true): MulticallRequest<string>
    getCurrentBlockDifficulty(): Promise<BigNumber>
    getCurrentBlockDifficulty(multicall: true): MulticallRequest<BigNumber>
    getCurrentBlockGasLimit(): Promise<BigNumber>
    getCurrentBlockGasLimit(multicall: true): MulticallRequest<BigNumber>
    getCurrentBlockTimestamp(): Promise<BigNumber>
    getCurrentBlockTimestamp(multicall: true): MulticallRequest<BigNumber>
    getEthBalance(addr: string): Promise<BigNumber>
    getEthBalance(addr: string, multicall: true): MulticallRequest<BigNumber>
    getLastBlockHash(): Promise<string>
    getLastBlockHash(multicall: true): MulticallRequest<string>
    functions: {
        aggregate(
            calls: CallStruct[],
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<ContractTransaction>
        getCurrentBlockTimestamp(
            overrides?: CallOverrides
        ): Promise<[BigNumber] & { timestamp: BigNumber }>
        getEthBalance(
            addr: string,
            overrides?: CallOverrides
        ): Promise<[BigNumber] & { balance: BigNumber }>
    }
    callStatic: {
        aggregate(
            calls: CallStruct[],
            overrides?: CallOverrides
        ): Promise<
            [BigNumber, string[]] & {
                blockNumber: BigNumber
                returnData: string[]
            }
        >
        getCurrentBlockTimestamp(overrides?: CallOverrides): Promise<BigNumber>
        getEthBalance(addr: string): Promise<BigNumber>
    }
}
