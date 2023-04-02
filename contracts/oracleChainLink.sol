// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract FetchFromArray is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    string public id;
    bytes public data;
    string public verify;
    bytes32 private jobId;
    uint256 private fee;

    event RequestFirstId(bytes32 indexed requestId, string id);

    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        setChainlinkOracle(0xCC79157eb46F5624204f47AB42b3906cAA40eaB7);
        jobId = "7da2702f37fd48e5b1b9a5715e3509b6";
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
    }

    function request() public {
        Chainlink.Request memory req = buildChainlinkRequest("7da2702f37fd48e5b1b9a5715e3509b6", address(this), this.fulfill.selector);
        req.add(
            "get",
            "https://ipfs.io/ipfs/QmPv7X19m1FzzFdMNtUiDvpBA9bZWfj3qGLd4NsJiCSkdo?filename=certidao.json"
        );
        req.add("path", "certidao");
        sendChainlinkRequest(req, (1 * LINK_DIVISIBILITY) / 10); // 0,1*10**18 LINK
    }

    function fulfill(bytes32 requestId, bytes memory bytesData) public recordChainlinkFulfillment(requestId) {
        data = bytesData;
        verify = string(data);
    }

    function getVerify() external view returns (string memory) {
        return verify;
    }
    
}
