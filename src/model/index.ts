import settingsModel, { SettingsModel } from './settingsModel'
import popupsModel, { PopupsModel } from './popupsModel'
import connectWalletModel, { ConnectWalletModel } from './connectWalletModel'
import safeModel, { SafeModel } from './safeModel'
import transactionsModel, { TransactionsModel } from './transactionsModel'
import auctionsModel, { AuctionsModel } from './auctionsModel'
import earnModel, { EarnModel } from './earnModel'
import multicallModel, { MulticallModel } from './multicallModel'

export interface StoreModel {
    settingsModel: SettingsModel
    popupsModel: PopupsModel
    connectWalletModel: ConnectWalletModel
    safeModel: SafeModel
    transactionsModel: TransactionsModel
    auctionsModel: AuctionsModel
    earnModel: EarnModel
    multicallModel: MulticallModel
}

const model: StoreModel = {
    settingsModel,
    popupsModel,
    connectWalletModel,
    safeModel,
    transactionsModel,
    auctionsModel,
    earnModel,
    multicallModel,
}

export default model
