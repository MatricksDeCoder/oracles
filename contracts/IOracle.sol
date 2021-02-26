// SPDX-License-Identifier: MIT

// Interface to allow us to interact with Oracle contract from e.g Consumer

pragma solidity ^0.7.3;

interface IOracle {

    function getData(bytes32 _key) external view returns(bool _result, uint _date, uint _result);

}

