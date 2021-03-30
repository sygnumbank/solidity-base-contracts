/**
 * @title IRaiseOperators
 * @notice Interface for RaiseOperators contract
 */

pragma solidity 0.5.12;

contract IRaiseOperators {
    function isInvestor(address _account) external view returns (bool);

    function isIssuer(address _account) external view returns (bool);

    function addInvestor(address _account) external;

    function removeInvestor(address _account) external;

    function addIssuer(address _account) external;

    function removeIssuer(address _account) external;
}
