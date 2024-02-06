import settingsModel, { SettingsModel } from './settingsModel'
import popupsModel, { PopupsModel } from './popupsModel'
import connectWalletModel, { ConnectWalletModel } from './connectWalletModel'
import safeModel, { SafeModel } from './safeModel'
import transactionsModel, { TransactionsModel } from './transactionsModel'
import multicallModel, { MulticallModel } from './multicallModel'
import auctionModel, { AuctionModel } from './auctionModel'
import depositModel, { DepositModel } from './depositModel'

export interface StoreModel {
    settingsModel: SettingsModel
    popupsModel: PopupsModel
    connectWalletModel: ConnectWalletModel
    safeModel: SafeModel
    transactionsModel: TransactionsModel
    multicallModel: MulticallModel
    auctionModel: AuctionModel
    depositModel: DepositModel
}

const model: StoreModel = {
    settingsModel,
    popupsModel,
    connectWalletModel,
    safeModel,
    transactionsModel,
    multicallModel,
    auctionModel,
    depositModel,
}

export default model
