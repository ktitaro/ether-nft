const hre = require('hardhat')

async function main() {
  await hre.run('compile')

  const factory = await hre.ethers.getContractFactory('NFT')
  const contract = await factory.deploy()
  await contract.deployed()

  console.log('NFT contract has been deployed!')
  console.log(`contract address: ${contract.address}`)

  const nftTx1 = await contract.mintNFT()
  await nftTx1.wait()

  const nftTx2 = await contract.mintNFT()
  await nftTx2.wait()
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
