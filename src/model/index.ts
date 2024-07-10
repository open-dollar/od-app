import settingsModel, { SettingsModel } from './settingsModel'
import popupsModel, { PopupsModel } from './popupsModel'
import connectWalletModel, { ConnectWalletModel } from './connectWalletModel'
import safeModel, { SafeModel } from './safeModel'
import globalSafeModel, { GlobalSafeModel } from './globalSafeModel'
import transactionsModel, { TransactionsModel } from './transactionsModel'
import multicallModel, { MulticallModel } from './multicallModel'
import auctionModel, { AuctionModel } from './auctionModel'
import bridgeModel, { BridgeModel } from './bridgeModel'
import nitroPoolsModel, { NitroPoolsModel } from './nitroPoolsModel'
import analyticsModel, { AnalyticsModel } from './analyticsModel'
import poolDataModel, { PoolDataModel } from '~/model/poolDataModel'
import boltsModel, { BoltsModel } from './boltsModel'

export interface StoreModel {
    settingsModel: SettingsModel
    popupsModel: PopupsModel
    connectWalletModel: ConnectWalletModel
    safeModel: SafeModel
    globalSafeModel: GlobalSafeModel
    transactionsModel: TransactionsModel
    multicallModel: MulticallModel
    auctionModel: AuctionModel
    bridgeModel: BridgeModel
    nitroPoolsModel: NitroPoolsModel
    analyticsModel: AnalyticsModel
    poolDataModel: PoolDataModel
    boltsModel: BoltsModel
}

const model: StoreModel = {
    settingsModel,
    popupsModel,
    connectWalletModel,
    safeModel,
    globalSafeModel,
    transactionsModel,
    multicallModel,
    auctionModel,
    bridgeModel,
    nitroPoolsModel,
    analyticsModel,
    poolDataModel,
    boltsModel,
}

export default model
