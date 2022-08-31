// SPDX-License-Identifier: UNLICENSED

/**
 * @title TradingPairWhitelist
 * @author Team 3301 <team3301@sygnum.com>
 * @dev TradingPairWhitelist contract that allows particular trading pairs available within the DEX.  Whitelisting/unwhitelisting
 *       is controlled by operators in Operatorable contract which is initialized with the relevant BaseOperators address.
 */

pragma solidity ^0.8.0;

import "../libraries/Bytes32Set.sol";
import "../role/trader/TraderOperatorable.sol";

contract TradingPairWhitelist is TraderOperatorable {
    using Bytes32Set for Bytes32Set.Set;

    Bytes32Set.Set internal pairs;
    mapping(bytes32 => Pair) public pair;
    mapping(address => mapping(address => bytes32)) public pairIdentifier;

    struct Pair {
        bool paired;
        bool frozen;
        address buyToken;
        address sellToken;
    }
    /**
     * @dev Error: "TradingPairWhitelist: pair is not whitelisted"
     */
    error TradingPairWhitelistPairNotWhitelisted();

    /**
     * @dev Error: "TradingPairWhitelist: batch count is greater than 256"
     */
    error TradingPairWhitelistBatchCountTooLarge(uint256 _batchCount);

    /**
     * @dev Error: "TradingPairWhitelistArrayLengthsNotEqual()"
     */
    error TradingPairWhitelistArrayLengthsNotEqual();

    /**
     * @dev Error: "TradingPairWhitelist: tokens cannot be empty"
     */
    error TradingPairWhitelistTokensEmpty(address _token1, address _token2);

    /**
     * @dev Error: "TradingPairWhitelist: buy and sell tokens cannot be the same"
     */
    error TradingPairWhitelistBuySellSameToken(address _token);

    /**
     * @dev Error: "TradingPairWhitelist: tokens have already been paired"
     */
    error TradingPairWhitelistTokensAlreadyPaired(address _token1, address _token2);

    /**
     * @dev Error: "TradingPairWhitelist: pair ID exists"
     */
    error TradingPairWhitelistPairIDExists(bytes32 _pairID);

    /**
     * @dev Error: "TradingPairWhitelist: pair ID not does not exist"
     */
    error TradingPairWhitelistUnknownPairID(bytes32 _pairID);

    /**
     * @dev Error: "TradingPairWhitelist: token pair is frozen"
     */
    error TradingPairWhitelistPairFrozen();

    /**
     * @dev Error: "TradingPairWhitelist: token pair is not frozen"
     */
    error TradingPairWhitelistPairNotFrozen();

    event PairedTokens(bytes32 indexed pairID, address indexed buytoken, address indexed sellToken);
    event DepairedTokens(bytes32 indexed pairID, address indexed buytoken, address indexed sellToken);
    event FrozenPair(bytes32 indexed pairID);
    event UnFrozenPair(bytes32 indexed pairID);

    /**
     * @dev Reverts if _buyToken and _sellToken are not paired.
     * @param _buyToken buy token against sell token to determine if whitelisted pair or not.
     * @param _sellToken sell token against buy token to determine if whitelisted pair or not.
     */
    modifier onlyPaired(address _buyToken, address _sellToken) {
        if (!isPaired(_buyToken, _sellToken)) revert TradingPairWhitelistPairNotWhitelisted();
        _;
    }

    /**
     * @dev Reverts if _buyToken and _sellToken are frozen.
     * @param _buyToken buy token against sell token to determine if frozen pair or not.
     * @param _sellToken sell token against buy token to determine if frozen pair or not.
     */
    modifier whenNotFrozen(address _buyToken, address _sellToken) {
        if (isFrozen(_buyToken, _sellToken)) revert TradingPairWhitelistPairFrozen();
        _;
    }

    /**
     * @dev Getter to determine if pairs are whitelisted.
     * @param _buyToken buy token against sell token to determine if whitelisted pair or not.
     * @param _sellToken sell token against buy token to determine if whitelisted pair or not.
     * @return bool is whitelisted pair.
     */
    function isPaired(address _buyToken, address _sellToken) public view virtual returns (bool) {
        return pair[pairIdentifier[_buyToken][_sellToken]].paired;
    }

    /**
     * @dev Getter to determine if pairs are frozen.
     * @param _buyToken buy token against sell token to determine if frozen pair or not.
     * @param _sellToken sell token against buy token to determine if frozen pair or not.
     * @return bool is frozen pair.
     */
    function isFrozen(address _buyToken, address _sellToken) public view virtual returns (bool) {
        return pair[pairIdentifier[_buyToken][_sellToken]].frozen;
    }

    /**
     * @dev Pair tokens to be available for trading on DEX.
     * @param _pairID pair identifier.
     * @param _buyToken buy token against sell token to whitelist.
     * @param _sellToken sell token against buy token to whitelist.
     */
    function pairTokens(
        bytes32 _pairID,
        address _buyToken,
        address _sellToken
    ) public onlyOperator {
        _pairTokens(_pairID, _buyToken, _sellToken);
    }

    /**
     * @dev Depair tokens to be available for trading on DEX.
     * @param _pairID pair identifier.
     */
    function depairTokens(bytes32 _pairID) public virtual onlyOperator {
        _depairTokens(_pairID);
    }

    /**
     * @dev Freeze pair trading on DEX.
     * @param _pairID pair identifier.
     */
    function freezePair(bytes32 _pairID) public virtual onlyOperatorOrTraderOrSystem {
        _freezePair(_pairID);
    }

    /**
     * @dev Unfreeze pair trading on DEX.
     * @param _pairID pair identifier.
     */
    function unfreezePair(bytes32 _pairID) public virtual onlyOperatorOrTraderOrSystem {
        _unfreezePair(_pairID);
    }

    /**
     * @dev Batch pair tokens.
     * @param _pairID array of pairID.
     * @param _buyToken address array of buyToken.
     * @param _sellToken address array of buyToken.
     */
    function batchPairTokens(
        bytes32[] memory _pairID,
        address[] memory _buyToken,
        address[] memory _sellToken
    ) public virtual onlyOperator {
        if (_pairID.length > 256) revert TradingPairWhitelistBatchCountTooLarge(_pairID.length);
        if (_pairID.length != _buyToken.length || _buyToken.length != _sellToken.length)
            revert TradingPairWhitelistArrayLengthsNotEqual();

        for (uint256 i = 0; i < _buyToken.length; ++i) {
            _pairTokens(_pairID[i], _buyToken[i], _sellToken[i]);
        }
    }

    /**
     * @dev Batch depair tokens.
     * @param _pairID array of pairID.
     */
    function batchDepairTokens(bytes32[] memory _pairID) public virtual onlyOperator {
        if (_pairID.length > 256) revert TradingPairWhitelistBatchCountTooLarge(_pairID.length);

        for (uint256 i = 0; i < _pairID.length; ++i) {
            _depairTokens(_pairID[i]);
        }
    }

    /**
     * @dev Batch freeze tokens.
     * @param _pairID array of pairID.
     */
    function batchFreezeTokens(bytes32[] memory _pairID) public virtual onlyOperatorOrTraderOrSystem {
        if (_pairID.length > 256) revert TradingPairWhitelistBatchCountTooLarge(_pairID.length);

        for (uint256 i = 0; i < _pairID.length; ++i) {
            _freezePair(_pairID[i]);
        }
    }

    /**
     * @dev Batch unfreeze tokens.
     * @param _pairID array of pairID.
     */
    function batchUnfreezeTokens(bytes32[] memory _pairID) public virtual onlyOperatorOrTraderOrSystem {
        if (_pairID.length > 256) revert TradingPairWhitelistBatchCountTooLarge(_pairID.length);

        for (uint256 i = 0; i < _pairID.length; ++i) {
            _unfreezePair(_pairID[i]);
        }
    }

    /**
     * @return Amount of pairs.
     */
    function getPairCount() public view virtual returns (uint256) {
        return pairs.count();
    }

    /**
     * @return Key at index.
     */
    function getIdentifier(uint256 _index) public view virtual returns (bytes32) {
        return pairs.keyAtIndex(_index);
    }

    /** INTERNAL FUNCTIONS */
    function _pairTokens(
        bytes32 _pairID,
        address _buyToken,
        address _sellToken
    ) internal virtual {
        if (_buyToken == address(0) || _sellToken == address(0))
            revert TradingPairWhitelistTokensEmpty(_buyToken, _sellToken);
        if (_buyToken == _sellToken) revert TradingPairWhitelistBuySellSameToken(_buyToken);
        if (isPaired(_buyToken, _sellToken)) revert TradingPairWhitelistTokensAlreadyPaired(_buyToken, _sellToken);
        if (pairs.exists(_pairID)) revert TradingPairWhitelistPairIDExists(_pairID);

        pair[_pairID] = Pair({paired: true, frozen: false, buyToken: _buyToken, sellToken: _sellToken});

        pairs.insert(_pairID);
        pairIdentifier[_buyToken][_sellToken] = _pairID;
        emit PairedTokens(_pairID, _buyToken, _sellToken);
    }

    function _depairTokens(bytes32 _pairID) internal virtual {
        if (!pairs.exists(_pairID)) revert TradingPairWhitelistUnknownPairID(_pairID);

        Pair memory p = pair[_pairID];

        delete pair[_pairID];
        pairs.remove(_pairID);
        delete pairIdentifier[p.buyToken][p.sellToken];
        emit DepairedTokens(_pairID, p.buyToken, p.sellToken);
    }

    function _freezePair(bytes32 _pairID) internal virtual {
        if (!pairs.exists(_pairID)) revert TradingPairWhitelistUnknownPairID(_pairID);
        if (pair[_pairID].frozen) revert TradingPairWhitelistPairFrozen();

        pair[_pairID].frozen = true;
        emit FrozenPair(_pairID);
    }

    function _unfreezePair(bytes32 _pairID) internal virtual {
        if (!pairs.exists(_pairID)) revert TradingPairWhitelistUnknownPairID(_pairID);
        if (!pair[_pairID].frozen) revert TradingPairWhitelistPairNotFrozen();

        pair[_pairID].frozen = false;
        emit UnFrozenPair(_pairID);
    }
}
