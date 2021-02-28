// SPDX-License-Identifier: MIT

pragma solidity ^0.7.3;

contract Oracle {

    struct Data {
        uint date;
        uint payload;
    }

    address public admin;

    // addresses that are allowed to report the data
    mapping(address => bool) public reporters;

    // storage for received struct type Data
    mapping(bytes32 => Data) internal data;

    // when status reporter updated to true or false
    event UpdateReporter(address _reporter, bool _isReporter);

    // when data is updated
    event UpdateData(address _updater, uint _payload);

    constructor(address _admin) {
        admin = _admin;
    }


    /// @notice update if an address is a reporter 
    /// @param _reporter the address to updated as true or false
    /// @param _isReporter the bool value of true or false to update reporter status
    function updateReporter(address _reporter, bool _isReporter) external {
        require(msg.sender == admin, 'Unauthorized only admin');
        reporters[_reporter] = _isReporter;
        emit UpdateReporter(_reporter, _isReporter);
    }

    /// @notice update with new payload
    /// @param _key key for storing and accessing data by e.g string "price"
    /// @param _payload data to store or update
    function updateData(bytes32 _key, uint _payload) external {
        require(reporters[msg.sender] == true, 'Unauthorized only reporter');
        Data memory _data = Data(block.timestamp, _payload);
        data[_key] = _data;
        emit UpdateData(msg.sender, _payload);
    }

    /// @notice function for a Consumer to get data from Oracle
    /// @param _key key for storing and accessing data by 
    /// @return _result true if data exists and false otherwise
    /// @return _date date the data was stored, 0 if data does not exist
    /// @return _payload required data e.g a price 45, 0 if data does not exist
    function getData(bytes32 _key) external view returns(bool _result, uint _date, uint _payload) {
        //check if struct is empty
        if(data[_key].date == 0) {
            return(false, 0, 0);
        } else {
            return(true, data[_key].date, data[_key].payload);
        }

    }


}

