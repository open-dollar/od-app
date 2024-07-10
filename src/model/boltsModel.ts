import { action, Action, thunk, Thunk } from 'easy-peasy'
import { BoltsEarnedData, MultipliersData } from '~/containers/Bolts/quests'
import { OD_API_URL } from '~/utils/constants'

type Campaign = {
    type: number
    amount: string
}

export type LeaderboardUser = {
    rank: number
    address: string
    bolts: number
    ens?: string
}

export interface BoltsModel {
    userBoltsData: {
        rank: string
        bolts: string
        multiplier: string
    }
    setUserBoltsData: Action<BoltsModel, { rank: string; bolts: string; multiplier: string }>

    leaderboardData: LeaderboardUser[]
    setLeaderboardData: Action<BoltsModel, LeaderboardUser[]>

    boltsEarnedData: BoltsEarnedData
    setBoltsEarnedData: Action<BoltsModel, BoltsEarnedData>

    multipliersData: MultipliersData
    setMultipliersData: Action<BoltsModel, MultipliersData>

    hasFetched: boolean
    setHasFetched: Action<BoltsModel, boolean>

    ensCache: { [address: string]: string }
    setEnsCache: Action<BoltsModel, { address: string; ens: string }>

    fetchData: Thunk<BoltsModel, { account: string | null }, any, BoltsModel>
}

const boltsModel: BoltsModel = {
    userBoltsData: {
        rank: '',
        bolts: '',
        multiplier: '',
    },
    setUserBoltsData: action((state, payload) => {
        state.userBoltsData = payload
    }),

    leaderboardData: [],
    setLeaderboardData: action((state, payload) => {
        state.leaderboardData = payload
    }),

    boltsEarnedData: {},
    setBoltsEarnedData: action((state, payload) => {
        state.boltsEarnedData = payload
    }),

    multipliersData: {},
    setMultipliersData: action((state, payload) => {
        state.multipliersData = payload
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
            const BOT_API = `${OD_API_URL}/bolts`
            const response = account ? await fetch(`${BOT_API}?address=${account}`) : await fetch(BOT_API)
            const result = await response.json()
            if (result.success) {
                const { leaderboard, user } = result.data
                const state = getState()

                // Populate ENS cache for leaderboard users
                leaderboard.forEach((user: LeaderboardUser) => {
                    const ens = state.ensCache[user.address] || null
                    if (ens) {
                        user.ens = ens
                    }
                })

                actions.setLeaderboardData(leaderboard)
                if (account && user) {
                    const boltsEarned: BoltsEarnedData = {}
                    const multipliers: MultipliersData = {}
                    user.campaigns?.forEach((campaign: Campaign) => {
                        boltsEarned[campaign.type] = campaign.amount.toLocaleString()
                    })
                    user.multipliers?.forEach((multiplier: Campaign) => {
                        multipliers[multiplier.type] = parseInt(multiplier.amount) > 0 ? 'Active' : 'Inactive'
                    })

                    actions.setUserBoltsData(user)
                    actions.setBoltsEarnedData(boltsEarned)
                    actions.setMultipliersData(multipliers)
                }
            }
            actions.setHasFetched(true)
        } catch (err) {
            console.error('Error fetching leaderboard data:', err)
        }
    }),
}

export default boltsModel
