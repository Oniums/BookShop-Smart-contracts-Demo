pragma solidity ^0.5.0;

contract Transaction {
    uint256 public datasCount;

    mapping(uint256 => data) public datas; 

    struct data {
        uint256 light; //光强
        uint256 timestamp; //时间戳
    }

    //添加书本
    function insertdata(uint256 timestamp,uint256 light) public{
        datasCount++;
        datas[datasCount] = data(light, timestamp);
    }

    constructor() public {
    }

    function getCount() public view returns(uint256){
        return datasCount;
    }
    
    function getValue(uint256 index) public view returns(uint256){
        return datas[index].light;
    }

    function getTime(uint256 index) public view returns(uint256){
        return datas[index].timestamp;
    }
}
