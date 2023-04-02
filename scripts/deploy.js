async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying contracts with the account:, ${deployer.address}`);

  console.log(`Account balance:, ${(await deployer.getBalance()).toString()}`);

  const Token = await ethers.getContractFactory("PosterityWallet");
  const token = await Token.deploy("07766232901", "0xBed97CF7FD3Ab850f2d03B9e573fD61598311989");

  console.log(`Contract address:, ${token.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });