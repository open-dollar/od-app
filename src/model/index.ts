import settingsModel, { SettingsModel } from './settingsModel'
import popupsModel, { PopupsModel } from './popupsModel'
import connectWalletModel, { ConnectWalletModel } from './connectWalletModel'
import safeModel, { SafeModel } from './safeModel'
import transactionsModel, { TransactionsModel } from './transactionsModel'
import multicallModel, { MulticallModel } from './multicallModel'

export interface StoreModel {
    settingsModel: SettingsModel
    popupsModel: PopupsModel
    connectWalletModel: ConnectWalletModel
    safeModel: SafeModel
    transactionsModel: TransactionsModel
    multicallModel: MulticallModel
}

const model: StoreModel = {
    settingsModel,
    popupsModel,
    connectWalletModel,
    safeModel,
    transactionsModel,
    multicallModel,
}

export default model
