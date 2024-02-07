export type ParsedNitroPool = {
    pool?: {
        tvl: number
        apr: number
        pendingRewards?: string
    }
    status?: {
        isActive: boolean
        duration: number
        endIn: number
    }
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
