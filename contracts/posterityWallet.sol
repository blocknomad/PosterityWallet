// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "./factoryPosterityWallet.sol";
import "./oracleChainLink.sol";

contract PosterityWallet {

    /// Heir Structure
    struct Heir {
        address userAddress;
        uint256 percentage;     
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        _;
    }

    event ResponseSituation(string indexed situation);

    APIConsumer oracle = APIConsumer(0x8160631Dea1b5BCe247Ad65B49fb02500BDaC3c0);
    PosterityWalletFactory posterityWalletFactory;

    bool public succession = false;

    string private taxID;

    uint256 public totalDistribuition = 0;

    address public owner;

    bytes32 public requestID;

    bytes32 public authorizedHeirResult;

    bytes32 public authorizedHeirFrase;

    uint256 public balance;

    /// Heir Array
    Heir[] public _heirs;


    mapping(address => bool) _heirsMap;

    constructor(string memory _taxID, address _owner) payable{
        taxID = _taxID;
        owner = _owner;
        posterityWalletFactory = PosterityWalletFactory(msg.sender);
    }
    

    /// Functions
    receive() external payable {
        require(succession == false, "Posterity Succession has already been started");
    }

    function gettaxID() public view returns (string memory) {
        return taxID;
    }

    function getHeirs() public view returns(Heir[] memory){
        return _heirs;
    }

    function changeHeirs(Heir[] calldata _newHeirs) public onlyOwner {

        totalDistribuition = 0;

        for (uint i = 0; i < _newHeirs.length; i++) {

            totalDistribuition += _newHeirs[i].percentage;
        }

        require(totalDistribuition >= 99 && totalDistribuition <= 100, "You need to complete 100% distribution");

        for (uint i = 0; i < _heirs.length; i++) {
            delete _heirsMap[_heirs[i].userAddress];
            posterityWalletFactory.deletePosterityWalletFromHeir(_heirs[i].userAddress, address(this));
        }

        delete _heirs;

        for (uint i = 0; i < _newHeirs.length; i++) {

            totalDistribuition += _newHeirs[i].percentage;

            _heirs.push(_newHeirs[i]);
            _heirsMap[_heirs[i].userAddress] = true;
            posterityWalletFactory.setPosterityWalletsFromHeir(_heirs[i].userAddress, address(this));
        }
    }

    function requestOracle() public {
        string memory taxId = gettaxID();
        requestID = oracle.requestSituationData(taxId);
    }

    function establishSucessorDeath(string memory authorizedHeir) external {
        require(succession == false,  "This succession has already started");
        require(msg.sender == 0x8160631Dea1b5BCe247Ad65B49fb02500BDaC3c0, "Only Oracle contract can call this function");

        authorizedHeirResult = keccak256(bytes(authorizedHeir));

        authorizedHeirFrase = keccak256(bytes("Cancelada"));

        emit ResponseSituation(authorizedHeir);

        require(authorizedHeirResult == authorizedHeirFrase, "Unable to start protocol");
        succession = true;
        withdrawTotal();
    }

    function withdrawTotal() internal {

        uint256 amountPerWallet;
        balance = address(this).balance;       
  
        for (uint i = 0; i < _heirs.length; i++) {

            amountPerWallet = (balance * _heirs[i].percentage ) / 100;
            payable(_heirs[i].userAddress).transfer(amountPerWallet);
        }
    }    
    
    function withdraw(uint256 amount, address to) public onlyOwner {
        require(amount <= address(this).balance, "The withdrawal amount is greater than the Contract balance");
        require(succession == false, "Posterity Succession has already been started");
        payable(to).transfer(amount);
    }

}
