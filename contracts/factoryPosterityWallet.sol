// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "./posterityWallet.sol";

contract PosterityWalletFactory {

    mapping(address => address) public posterityWallets;

    mapping(address => address[]) public posterityWalletsFromHeir;
    mapping(address => mapping(address => uint256)) public posterityWalletsIndexesFromHeir;

    event NewPosteriryWallet(address indexed _owner, address indexed _newWallet);

    constructor() {}

    function deploy(string memory taxID) public {

        PosterityWallet posterityWallet = new PosterityWallet(taxID, msg.sender);
        posterityWallets[msg.sender] = address(posterityWallet);

        emit NewPosteriryWallet(msg.sender, posterityWallets[msg.sender]);
    }

    function getPosterityWallet(address userAddress) public view returns(address){
        return posterityWallets[userAddress];
    }


    function getPosterityWalletsFromHeir(address addressHeir) external view returns(address[] memory) {
        return posterityWalletsFromHeir[addressHeir];
    }

    function setPosterityWalletsFromHeir(address addressHeir, address addressPosterityWallet) external  {   

        posterityWalletsFromHeir[addressHeir].push(addressPosterityWallet);
        posterityWalletsIndexesFromHeir[addressHeir][addressPosterityWallet] = posterityWalletsFromHeir[addressHeir].length;
    }

    function deletePosterityWalletFromHeir(address addressHeir, address addressPosterityWallet) external  {   

        delete posterityWalletsFromHeir[addressHeir][posterityWalletsIndexesFromHeir[addressHeir][addressPosterityWallet] - 1];
        delete posterityWalletsIndexesFromHeir[addressHeir][addressPosterityWallet];
    }

}