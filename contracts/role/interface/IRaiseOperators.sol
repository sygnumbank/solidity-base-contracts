/**
 * @title IRaiseOperators
 * @notice Interface for RaiseOperators contract
 */

pragma solidity ^0.8.0;

abstract contract IRaiseOperators {
    function isInvestor(address _account) external view virtual returns (bool);

    function isIssuer(address _account) external view virtual returns (bool);

    function addInvestor(address _account) external virtual;

    function removeInvestor(address _account) external virtual;

    function addIssuer(address _account) external virtual;

    function removeIssuer(address _account) external virtual;
}
