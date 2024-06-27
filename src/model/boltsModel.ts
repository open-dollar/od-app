import { action, Action, thunk, Thunk } from 'easy-peasy'
import { BoltsEarnedData } from '~/containers/Bolts/quests'

type Conversion = {
    is_referrer: boolean
    conversion_id: number
    conversion_name: string
    total_amount: string
}

export type LeaderboardUser = {
    rank: number
    address: string
    points: number
    ens?: string
}

export interface BoltsModel {
    userFuulData: {
        rank: string
        points: string
    }
    setUserFuulData: Action<BoltsModel, { rank: string; points: string }>

    leaderboardData: LeaderboardUser[]
    setLeaderboardData: Action<BoltsModel, LeaderboardUser[]>

    boltsEarnedData: BoltsEarnedData
    setBoltsEarnedData: Action<BoltsModel, BoltsEarnedData>

    hasFetched: boolean
    setHasFetched: Action<BoltsModel, boolean>

    ensCache: { [address: string]: string }
    setEnsCache: Action<BoltsModel, { address: string; ens: string }>

    fetchData: Thunk<BoltsModel, { account: string | null }, any, BoltsModel>
}

const boltsModel: BoltsModel = {
    userFuulData: {
        rank: '',
        points: '',
    },
    setUserFuulData: action((state, payload) => {
        state.userFuulData = payload
    }),

    leaderboardData: [],
    setLeaderboardData: action((state, payload) => {
        state.leaderboardData = payload
    }),

    boltsEarnedData: {},
    setBoltsEarnedData: action((state, payload) => {
        state.boltsEarnedData = payload
    }),

    hasFetched: false,
    setHasFetched: action((state, payload) => {
        state.hasFetched = payload
    }),

    ensCache: {},
    setEnsCache: action((state, { address, ens }) => {
        state.ensCache[address] = ens
    }),

    fetchData: thunk(async (actions, { account }, { getState }) => {
        try {
            const BOT_DOMAIN = 'https://bot.opendollar.com'
            const BOT_API = `${BOT_DOMAIN}/api/bolts`
            const response = account ? await fetch(`${BOT_API}?address=${account}`) : await fetch(BOT_API)
            const result = await response.json()
            if (result.success) {
                const users = result.data.fuul.leaderboard.users
                const state = getState()

                // Populate ENS cache for leaderboard users
                users.forEach((user: LeaderboardUser) => {
                    const ens = state.ensCache[user.address] || null
                    if (ens) {
                        user.ens = ens
                    }
                })

                actions.setLeaderboardData(users)

                if (account) {
                    actions.setUserFuulData(result.data.fuul.user)

                    const boltsEarned: BoltsEarnedData = {}
                    const { data } = result
                    let combinedBorrowBolts = 0
                    let combinedDepositBolts = 0
                    data.fuul.user.conversions.forEach((conversion: Conversion) => {
                        if ([1, 2].includes(conversion.conversion_id))
                            combinedBorrowBolts += parseInt(conversion.total_amount)
                        else if ([3, 4].includes(conversion.conversion_id))
                            combinedDepositBolts += parseInt(conversion.total_amount)
                        else boltsEarned[conversion.conversion_id] = parseInt(conversion.total_amount).toLocaleString()
                    })
                    boltsEarned[1] = combinedBorrowBolts.toLocaleString()
                    boltsEarned[3] = combinedDepositBolts.toLocaleString()

                    boltsEarned['OgNFT'] = data.OgNFT ? 'Yes' : 'No'
                    boltsEarned['OgNFV'] = data.OgNFV ? 'Yes' : 'No'
                    boltsEarned['GenesisNFT'] = data.GenesisNFT ? 'Yes' : 'No'

                    actions.setBoltsEarnedData(boltsEarned)
                }
            }
            actions.setHasFetched(true)
        } catch (err) {
            console.error('Error fetching leaderboard data:', err)
        }
    }),
}

export default boltsModel
