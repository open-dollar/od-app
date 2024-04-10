import settingsModel, { SettingsModel } from './settingsModel'
import popupsModel, { PopupsModel } from './popupsModel'
import connectWalletModel, { ConnectWalletModel } from './connectWalletModel'
import safeModel, { SafeModel } from './safeModel'
import transactionsModel, { TransactionsModel } from './transactionsModel'
import multicallModel, { MulticallModel } from './multicallModel'
import auctionModel, { AuctionModel } from './auctionModel'
import bridgeModel, { BridgeModel } from './bridgeModel'

export interface StoreModel {
    settingsModel: SettingsModel
    popupsModel: PopupsModel
    connectWalletModel: ConnectWalletModel
    safeModel: SafeModel
    transactionsModel: TransactionsModel
    multicallModel: MulticallModel
    auctionModel: AuctionModel
    bridgeModel: BridgeModel
}

const model: StoreModel = {
    settingsModel,
    popupsModel,
    connectWalletModel,
    safeModel,
    transactionsModel,
    multicallModel,
    auctionModel,
    bridgeModel
}

export default model
