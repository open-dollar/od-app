import { JsonRpcSigner } from '@ethersproject/providers/lib/json-rpc-provider'
import { DefaultTheme, ThemedCssFunction } from 'styled-components'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { TokenData } from '@hai-on-op/sdk/lib/contracts/addreses'
import { TransactionResponse } from '@ethersproject/providers'
import { Geb } from '@hai-on-op/sdk'
import { BigNumber } from 'ethers'

export declare enum ChainId {
    MAINNET = 1,
    GOERLI = 5,
    OPTIMISM_GOERLI = 420,
}

export interface DynamicObject {
    [key: string]: any
}

interface IColors {
    primary: string
    secondary: string
    gradient: string
    neutral: string
    background: string
    overlay: string
    border: string
    foreground: string
    dangerColor: string
    dangerBackground: string
    dangerBorder: string
    alertColor: string
    alertBackground: string
    alertBorder: string
    successColor: string
    successBackground: string
    successBorder: string
    warningColor: string
    warningBackground: string
    warningBorder: string
    placeholder: string
    inputBorderColor: string
    boxShadow: string
    customSecondary: string
    greenish: string
    blueish: string
    yellowish: string
    dimmedColor: string
    dimmedBackground: string
    dimmedBorder: string
    colorPrimary: string
    colorSecondary: string
}

interface IFonts {
    extraSmall: string
    small: string
    default: string
    medium: string
    large: string
    extraLarge: string
}

interface IGlobal {
    gridMaxWidth: string
    borderRadius: string
    extraCurvedRadius: string
    buttonPadding: string
    modalWidth: string
}

interface IMediaWidth {
    upToExtraSmall: ThemedCssFunction<DefaultTheme>
    upToSmall: ThemedCssFunction<DefaultTheme>
    upToMedium: ThemedCssFunction<DefaultTheme>
    upToLarge: ThemedCssFunction<DefaultTheme>
}

export interface Theme {
    colors: IColors
    font: IFonts
    global: IGlobal
    mediaWidth: IMediaWidth
}

export interface LangOption {
    name: string
    code: string
}

export interface NavLinkType {
    type: string
    text: string
}

export interface ISafeData {
    totalCollateral: string
    totalDebt: string
    leftInput: string
    rightInput: string
    collateralRatio: number
    liquidationPrice: number
    isGnosisSafe?: boolean
    collateral: string
}

export interface IBlockNumber {
    [chainId: number]: number
}

export interface ITokenBalance {
    [chainId: number]: number | string
}

export interface WalletInfo {
    connector?: AbstractConnector
    name: string
    iconName: string
    description: string
    href: string | null
    color: string
    primary?: true
    mobile?: true
    mobileOnly?: true
}

export interface ISafe {
    id: string
    date: string
    safeHandler: string
    riskState: number
    collateral: string
    debt: string
    totalDebt: string
    availableDebt: string
    accumulatedRate: string
    collateralRatio: string
    currentRedemptionPrice: string
    currentLiquidationPrice: string
    internalCollateralBalance: string
    liquidationCRatio: string
    liquidationPenalty: string
    liquidationPrice: string
    totalAnnualizedStabilityFee: string
    currentRedemptionRate: string
    collateralType: string
    collateralName: string
}

export interface LoadingPayload {
    isOpen: boolean
    text: string
}

export interface IOperation {
    isOpen: boolean
    type: string
}

export interface IAuctionOperation extends IOperation {
    auctionType: string
}
export interface IAlert {
    type: string
    text: string
}

export interface IVotingTx {
    id: string
    date: string
    title: string
    text?: string
    endsIn: string
    isCompleted: boolean
    isAbandoned: boolean
}

export interface ILiquidationData {
    currentRedemptionPrice: string
    currentRedemptionRate: string
    globalDebt: string
    perSafeDebtCeiling: string
    globalDebtCeiling: string
    collateralLiquidationData: { [key: string]: CollateralLiquidationData }
}

export interface ISafePayload {
    safeData: ISafeData
    signer: JsonRpcSigner
}

export interface IWaitingPayload {
    title?: string
    text?: string
    hint?: string
    status: string
    hash?: string
    isCreate?: boolean
}

export interface SerializableTransactionReceipt {
    to: string
    from: string
    contractAddress: string
    transactionIndex: number
    blockHash: string
    transactionHash: string
    blockNumber: number
    status?: number
}
export interface ITransaction {
    chainId: ChainId
    hash: string
    from: string
    receipt?: SerializableTransactionReceipt
    summary?: string
    lastCheckedBlockNumber?: number
    addedTime: number
    confirmedTime?: number
    originalTx: TransactionResponse
    approval?: { tokenAddress: string; spender: string }
}

export interface NumberMap {
    [key: string]: number
}

export interface AssetData {
    img: string
    token: string
    name: string
    amount: number
    price: number
    value: number
    diff: number
    diffPercentage: number
}
export interface IIncentiveAssets {
    eth: AssetData
    hai: AssetData
    flx: AssetData
    uni: AssetData
}

export interface ISafeResponse {
    collateral: string
    createdAt: string | null // Will be null in RPC mode;
    debt: string
    safeHandler: string
    safeId: string
    collateralType: string
}

// query responses for the safes
export interface ILiquidationResponse {
    collateralLiquidationData: { [key: string]: CollateralLiquidationData }
    systemState: SystemSate
}

export interface CollateralLiquidationData {
    accumulatedRate: string
    currentPrice: {
        liquidationPrice: string
        safetyPrice: string
        value: string
    }
    debtFloor: string
    liquidationCRatio: string
    liquidationPenalty: string
    safetyCRatio: string
    totalAnnualizedStabilityFee: string
}

export interface SystemSate {
    currentRedemptionPrice: {
        value: string
    }
    currentRedemptionRate: {
        annualizedRate: string
    }
    globalDebt: string
    globalDebtCeiling: string
    perSafeDebtCeiling: string
}

export interface IUserSafeList extends ILiquidationResponse {
    erc20Balances: Array<{ balance: string }>
    safes: Array<ISafeResponse>
}

export interface IModifySAFECollateralization {
    deltaDebt: string
    deltaCollateral: string
    createdAt: string
    createdAtTransaction: string
    accumulatedRate: string
}

export interface ILiquidationFixedDiscount {
    sellInitialAmount: string
    sellAmount: string
    createdAt: string
    createdAtTransaction: string
}

export interface ISingleSafe {
    safeId: string
    safeHandler: string
    collateral: string
    createdAt: string | null // Will be null in RPC mode
    debt: string
    internalCollateralBalance: {
        balance: string
    }
    modifySAFECollateralization: Array<IModifySAFECollateralization> | null // Will be null over RPC;
    liquidationDiscount: Array<ILiquidationFixedDiscount> | null // Will be null over RPC
}
export interface ISafeQuery extends ILiquidationResponse {
    erc20Balances: Array<{ balance: string }>
    safes: Array<ISingleSafe>
    userProxies: [
        {
            address: string
            coinAllowance: {
                amount: string
            } | null
        }
    ]
}

export interface IFetchTokensDataPayload {
    geb: Geb
    user: string
    tokens?: string[]
}

export interface IFetchSafesPayload {
    address: string
    geb: Geb
    tokensData: { [key: string]: TokenData }
}

export interface IFetchSafeById extends IFetchSafesPayload {
    safeId: string
}

export interface IPaging {
    from: number
    to: number
}

export interface IManageSafe {
    safeId: string
    owner: {
        id: string
    }
}

export interface Distribution {
    distributionIndex: number
    distributorAddress: string
    isClaimed: boolean
    description: string
    index: number
    amount: string
    proof: string[]
    createdAt: number
}

export interface Distro {
    from: string
    until: string
    amount: string
    name: string
    description: string
    link: string
    optional: { [key: string]: string | undefined }
    image: string
    apy_description: string
    apy: string
    apy_title: string
}

export interface Round {
    number: number
    name: string
    distros: Distro[]
    snapshotDate: string
    distributionDate: string
    starMessage?: string
}

export interface IncentivesDocument {
    rounds: Round[]
}

export interface Slot0 {
    sqrtPriceX96: BigNumber
    tick: number
    observationIndex: number
    observationCardinality: number
    observationCardinalityNext: number
    feeProtocol: number
    unlocked: boolean
}
export interface Position {
    id: string
    lowerTick: number
    upperTick: number
    uniLiquidity: BigNumber
    threshold: BigNumber
}

export interface PositionsAndThreshold {
    slot0: Slot0
    p1: Position
    p2: Position
    t1: Tranche
    t2: Tranche
}

export interface Tranche {
    lowerTick: number
    upperTick: number
}

export interface ILiquidityData {
    haiAmount: string
    ethAmount: string
    totalLiquidity: string
}

export interface IStakingData {
    stFlxAmount: string
    stakingAmount: string
}

export interface Call {
    address: string
    callData: string
    gasRequired?: number
}

export interface CallListeners {
    // on a per-chain basis
    [chainId: number]: {
        // stores for each call key the listeners' preferences
        [callKey: string]: {
            // stores how many listeners there are per each blocks per fetch preference
            [blocksPerFetch: number]: number
        }
    }
}

export interface CallResults {
    // on a per-chain basis
    [chainId: number]: {
        [callKey: string]: {
            data?: string | null
            blockNumber?: number
            fetchingBlockNumber?: number
        }
    }
}
