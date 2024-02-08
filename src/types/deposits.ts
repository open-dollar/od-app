import { TokenData } from '@opendollar/sdk'

export type ParsedNitroPool = {
    pool?: {
        tvl: number
        apr: number
        address: string
        isActive: boolean
        duration: number
        endsIn: number
        pendingRewards: number
        authorizations?: {
            depositsEnabled: boolean
            depositsEndIn: number
            harvestsEnabled: boolean
        }
        requirements?: {
            lockDuration: number
            lockUntil: number
            whitelist: boolean
        }
    }
    user?: {
        deposit?: string
        pendingRewards?: string
        averageApr?: number
    }
    tokens?: {
        reward: TokenData
        collateral: TokenData
    }
}
