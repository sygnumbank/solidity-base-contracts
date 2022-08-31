pragma solidity ^0.8.8;

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
library Roles {
    struct Role {
        mapping(address => bool) bearer;
    }

    /**
     * @dev Error: "Roles: account already has role"
     */
    error RolesAccountAlreadyHasRole(address _account);

    /**
     * @dev Error: "Roles: account does not have role"
     */
    error RolesAccountDoesNotHaveRole(address _account);

    /**
     * @dev Error: "Roles: account is the zero address"
     */
    error RolesAccountIsZeroAddress();

    /**
     * @dev Give an account access to this role.
     */
    function add(Role storage role, address account) internal {
        if (has(role, account)) revert RolesAccountAlreadyHasRole(account);
        role.bearer[account] = true;
    }

    /**
     * @dev Remove an account's access to this role.
     */
    function remove(Role storage role, address account) internal {
        if (!has(role, account)) revert RolesAccountDoesNotHaveRole(account);
        role.bearer[account] = false;
    }

    /**
     * @dev Check if an account has this role.
     * @return bool
     */
    function has(Role storage role, address account) internal view returns (bool) {
        if (account == address(0)) revert RolesAccountIsZeroAddress();
        return role.bearer[account];
    }
}
