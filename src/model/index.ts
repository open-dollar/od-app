import settingsModel, { SettingsModel } from './settingsModel'
import popupsModel, { PopupsModel } from './popupsModel'
import connectWalletModel, { ConnectWalletModel } from './connectWalletModel'
import safeModel, { SafeModel } from './safeModel'
import transactionsModel, { TransactionsModel } from './transactionsModel'
import multicallModel, { MulticallModel } from './multicallModel'
import auctionModel, { AuctionModel } from './auctionModel'
import bridgeModel, { BridgeModel } from './bridgeModel'
import nitroPoolsModel, { NitroPoolsModel } from './nitroPoolsModel'
import analyticsModel, { AnalyticsModel } from './analyticsModel'
import poolDataModel, { PoolDataModel } from '~/model/poolDataModel'

export interface StoreModel {
    settingsModel: SettingsModel
    popupsModel: PopupsModel
    connectWalletModel: ConnectWalletModel
    safeModel: SafeModel
    transactionsModel: TransactionsModel
    multicallModel: MulticallModel
    auctionModel: AuctionModel
    bridgeModel: BridgeModel
    nitroPoolsModel: NitroPoolsModel
    analyticsModel: AnalyticsModel
    poolDataModel: PoolDataModel
}

const model: StoreModel = {
    settingsModel,
    popupsModel,
    connectWalletModel,
    safeModel,
    transactionsModel,
    multicallModel,
    auctionModel,
    bridgeModel,
    nitroPoolsModel,
    analyticsModel,
    poolDataModel,
}

export default model
