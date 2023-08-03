// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IERC20 {
    function balanceOf(address guy) external view returns (uint256);
}

interface IAccountingEngine {
    struct AccountingEngineParams {
        // Whether the system transfers surplus instead of auctioning it
        uint256 surplusIsTransferred;
        // Delay between surplus actions
        uint256 surplusDelay;
        // Delay after which debt can be popped from debtQueue
        uint256 popDebtDelay;
        // Time to wait (post settlement) until any remaining surplus can be transferred to the settlement auctioneer
        uint256 disableCooldown;
        // Amount of surplus stability fees transferred or sold in one surplus auction
        uint256 surplusAmount;
        // Amount of stability fees that need to accrue in this contract before any surplus auction can start
        uint256 surplusBuffer;
        // Amount of protocol tokens to be minted post-auction
        uint256 debtAuctionMintedTokens;
        // Amount of debt sold in one debt auction (initial coin bid for debtAuctionMintedTokens protocol tokens)
        uint256 debtAuctionBidSize;
    }

    function params() external view returns (AccountingEngineParams memory _params);

    function totalOnAuctionDebt() external view returns (uint256 _totalOnAuctionDebt);

    function totalQueuedDebt() external view returns (uint256 _totalQueuedDebt);

    function debtQueue(uint256 _blockTimestamp) external view returns (uint256 _debtQueue);

    function lastSurplusTime() external view returns (uint256 _lastSurplusTime);

    function unqueuedUnauctionedDebt() external view returns (uint256 _unqueuedUnauctionedDebt);

    function disableTimestamp() external view returns (uint256 _disableTimestamp);
}

interface ISurplusAuctionHouse {
    struct SurplusAuctionHouseParams {
        // Minimum bid increase compared to the last bid in order to take the new one in consideration
        uint256 bidIncrease; // [wad]
        // How long the auction lasts after a new bid is submitted
        uint256 bidDuration; // [seconds]
        // Total length of the auction
        uint256 totalAuctionLength; // [seconds]
        uint256 recyclingPercentage;
    }

    function params() external view returns (SurplusAuctionHouseParams memory _params);
}

interface IDebtAuctionHouse {
    struct DebtAuctionHouseParams {
        // Minimum bid increase compared to the last bid in order to take the new one in consideration
        uint256 bidDecrease; // [wad]
        // Increase in protocol tokens sold in case an auction is restarted
        uint256 amountSoldIncrease; // [wad]
        // How long the auction lasts after a new bid is submitted
        uint256 bidDuration; // [seconds]
        // Total length of the auction
        uint256 totalAuctionLength; // [seconds]
    }

    function params() external view returns (DebtAuctionHouseParams memory _params);
}

interface ISAFEEngine {
    function coinBalance(address _coinAddress) external view returns (uint256 _balance);

    function debtBalance(address _coinAddress) external view returns (uint256 _debtBalance);
}

contract VirtualAuctionsData {
    struct IAccountingEngineData {
        IAccountingEngine.AccountingEngineParams accountingEngineParams;
        uint256 totalOnAuctionDebt;
        uint256 totalQueuedDebt;
        uint256 debtQueue;
        uint256 lastSurplusTime;
        uint256 unqueuedUnauctionedDebt;
        uint256 disableTimestamp;
        uint256 coinBalance;
        uint256 debtBalance;
    }

    struct AuctionsData {
        ISurplusAuctionHouse.SurplusAuctionHouseParams surplusAuctionHouseParams;
        IDebtAuctionHouse.DebtAuctionHouseParams debtAuctionHouseParams;
        IAccountingEngineData accountingEngineData;
        uint256 protocolTokenProxyBalance;
        uint256 coinTokenProxyBalance;
        uint256 coinTokenSafeBalance;
    }

    constructor(
        ISurplusAuctionHouse _surplusAuctionHouse,
        IDebtAuctionHouse _debtAuctionHouse,
        IAccountingEngine _accountingEngine,
        ISAFEEngine _safeEngine,
        address _proxy,
        IERC20 _protocolToken,
        IERC20 _coinToken
    ) {
        AuctionsData memory auctionsData = AuctionsData({
            surplusAuctionHouseParams: _surplusAuctionHouse.params(),
            debtAuctionHouseParams: _debtAuctionHouse.params(),
            accountingEngineData: IAccountingEngineData({
                accountingEngineParams: _accountingEngine.params(),
                totalOnAuctionDebt: _accountingEngine.totalOnAuctionDebt(),
                totalQueuedDebt: _accountingEngine.totalQueuedDebt(),
                debtQueue: _accountingEngine.debtQueue(block.timestamp),
                lastSurplusTime: _accountingEngine.lastSurplusTime(),
                unqueuedUnauctionedDebt: _accountingEngine.unqueuedUnauctionedDebt(),
                disableTimestamp: _accountingEngine.disableTimestamp(),
                coinBalance: _safeEngine.coinBalance(address(_accountingEngine)),
                debtBalance: _safeEngine.debtBalance(address(_accountingEngine))
            }),
            protocolTokenProxyBalance: _protocolToken.balanceOf(_proxy),
            coinTokenProxyBalance: _coinToken.balanceOf(_proxy),
            coinTokenSafeBalance: _safeEngine.coinBalance(_proxy)
        });

        // encode return data
        bytes memory data = abi.encode(auctionsData);

        // force constructor return via assembly
        assembly {
            let dataStart := add(data, 32) // abi.encode adds an additional offset
            return(dataStart, sub(msize(), dataStart))
        }
    }
}
