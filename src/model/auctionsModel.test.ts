import { createStore, EasyPeasyConfig, Store } from 'easy-peasy'
import { IAuction } from '../utils/interfaces'
import auctionsModel, { AuctionsModel } from './auctionsModel'

const debtAuctionsMock: IAuction[] = [
    {
        auctionDeadline: '1614336208',
        auctionId: '50',
        buyAmount: '85',
        buyInitialAmount: '85',
        buyToken: 'COIN',
        createdAt: '1614335868',
        createdAtTransaction: '0x0',
        englishAuctionBids: [
            {
                bidder: '0x0',
                buyAmount: '85',
                createdAt: '1614335888',
                createdAtTransaction: '0x0',
                sellAmount: '0.97087378640776699',
            },
            {
                bidder: '0x0',
                buyAmount: '85',
                createdAt: '1614335932',
                createdAtTransaction: '0x0',
                sellAmount: '0.942595909133754359',
            },
            {
                bidder: '0x0',
                buyAmount: '85',
                createdAt: '1614335956',
                createdAtTransaction: '0x0',
                sellAmount: '0.915141659353159571',
            },
            {
                bidder: '0x0',
                buyAmount: '85',
                createdAt: '1614336000',
                createdAtTransaction: '0x0',
                sellAmount: '0.8',
            },
            {
                bidder: '0x0',
                buyAmount: '85',
                createdAt: '1614336028',
                createdAtTransaction: '0x0',
                sellAmount: '0.776699029126213592',
            },
        ],
        biddersList: [
            {
                bidder: '0x0',
                buyAmount: '85',
                createdAt: '1614335888',
                createdAtTransaction: '0x0',
                sellAmount: '0.97087378640776699',
            },
            {
                bidder: '0x0',
                buyAmount: '85',
                createdAt: '1614335932',
                createdAtTransaction: '0x0',
                sellAmount: '0.942595909133754359',
            },
            {
                bidder: '0x0',
                buyAmount: '85',
                createdAt: '1614335956',
                createdAtTransaction: '0x0',
                sellAmount: '0.915141659353159571',
            },
            {
                bidder: '0x0',
                buyAmount: '85',
                createdAt: '1614336000',
                createdAtTransaction: '0x0',
                sellAmount: '0.8',
            },
            {
                bidder: '0x0',
                buyAmount: '85',
                createdAt: '1614336028',
                createdAtTransaction: '0x0',
                sellAmount: '0.776699029126213592',
            },
        ],
        englishAuctionConfiguration: {
            DEBT_amountSoldIncrease: '1.2',
            bidDuration: '180',
            bidIncrease: '1.03',
            totalAuctionLength: '300',
        },
        englishAuctionType: 'DEBT',
        isClaimed: true,
        sellAmount: '0.776699029126213592',
        sellInitialAmount: '1',
        sellToken: 'PROTOCOL_TOKEN',
        startedBy: '0x0',
        winner: '0x0',
    },
]
describe('safe model', () => {
    let store: Store<AuctionsModel, EasyPeasyConfig<{}, any>>

    beforeEach(() => {
        store = createStore(auctionsModel)
    })

    describe('setsAuctions', () => {
        it('sets auctions data', () => {
            store.getActions().setAuctionsData(debtAuctionsMock)
            expect(store.getState().autctionsData).toEqual(debtAuctionsMock)
        })
    })

    describe('setsSelectedAuctions', () => {
        it('sets selected auction', () => {
            store.getActions().setSelectedAuction(debtAuctionsMock[0])
            expect(store.getState().selectedAuction).toEqual(
                debtAuctionsMock[0]
            )
        })
    })

    describe('setsInternalBalance', () => {
        it('sets internal balance', () => {
            store.getActions().setInternalBalance('2.23')
            expect(store.getState().internalBalance).toEqual('2.23')
        })
    })

    describe('setsCoinBalances', () => {
        it('sets coin balances', () => {
            const coinBalances = { rai: '2', flx: '2' }
            store.getActions().setCoinBalances({ rai: '2', flx: '2' })
            expect(store.getState().coinBalances).toEqual(coinBalances)
        })
    })
})
