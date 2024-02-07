import { NitroPoolDetails } from '@opendollar/sdk'
import { ParsedNitroPool } from '~/types/deposits'

export const getParsedNitroPool = (pool: NitroPoolDetails): ParsedNitroPool => {
    if (!pool) {
        return {}
    }

    const { tvl, apy, userInfo, settings } = pool

    const now = Date.now()

    const startTimeMs = settings.startTime.toNumber() * 1000
    const endTimeMs = settings.endTime.toNumber() * 1000
    const depositEndTimeMs = settings.depositEndTime.toNumber() * 1000
    const harvestStartTime = settings.harvestStartTime.toNumber() * 1000
    const lockDuration = settings.lockDurationReq.toNumber() * 1000
    const lockUntil = settings.lockEndReq.toNumber() * 1000

    return {
        pool: {
            tvl,
            apr: apy,
            pendingRewards: userInfo?.pendingRewardsToken1.toString(),
        },
        status: {
            isActive: endTimeMs > now,
            duration: endTimeMs - startTimeMs,
            endIn: endTimeMs > now ? endTimeMs - now : 0,
        },
        authorizations: {
            depositsEnabled: !depositEndTimeMs || depositEndTimeMs > now,
            depositsEndIn: depositEndTimeMs > now ? depositEndTimeMs - now : 0,
            harvestsEnabled: harvestStartTime < now,
        },
        requirements: {
            lockDuration,
            lockUntil,
            whitelist: settings.whitelist,
        },
    }
}
