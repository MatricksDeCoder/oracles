// SPDX-License-Identifier: MIT

pragma solidity ^0.7.3;

import './IOracle.sol';

contract Consumer {

    IOracle public oracle;

    constructor(address _oracle) {
        oracle = IOracle(_oracle);
    }        

    /// @notice  use data from Oracle
    function useOracleData() external view returns(uint) {
        bytes32 _key = keccak256(abi.encodePacked('BTC/USD'));
        (bool _result, uint _date, uint _payload) = oracle.getData(_key);
        require(_result == true, 'could not get data');
        require(_date >= block.timestamp - 2 minutes, 'data too old');
        require(_payload > 0, ' invalid price' );
        // can do something with the price
        return _payload;
    }

}
