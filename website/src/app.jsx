import { ethers } from 'ethers'
import { useState, useEffect } from 'preact/hooks'
import contractSpec from '../../dapp/artifacts/contracts/NFT.sol/NFT.json'
import './app.css'

export function App() {
  const [minting, setMinting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [failure, setFailure] = useState(false)
  const [account, setAccount] = useState('')
  const [tokenID, setTokenID] = useState('')

  const contractABI = contractSpec.abi
  const contractAddr = '0xd522853f214A7ECd3297dC23300B039724EeA5C1'

  const getEthereumAPI = () => {
    const { ethereum } = window
    if (!ethereum) throw 'Make sure you have metamask'
    return ethereum
  }

  const getContractAPI = () => {
    const ethereum = getEthereumAPI()
    const provider = new ethers.providers.Web3Provider(ethereum)
    const contract = new ethers.Contract(contractAddr, contractABI, provider.getSigner())
    return contract
  }

  const checkAccountConnected = async () => {
    setLoading(true)
    const ethereum = getEthereumAPI()
    const accounts = await ethereum.request({
      method: 'eth_accounts'
    })

    if (!accounts.length) {
      console.log('No authorized accounts found')
      return
    }

    const account = accounts[0]
    console.log('Found authorized account:', account)
    setAccount(account)
    setTimeout(() => setLoading(false), 500)
  }

  const createNFT = async () => {
    setLoading(true)
    setMinting(true)
    setFailure(false)
    setTokenID('')

    try {
      const contract = getContractAPI()
      const tx = await contract.mintNFT()
      await tx.wait()
      console.log(`https://rinkeby.etherscan.io/tx/${tx.hash}`)
    } catch(err) {
      console.error(err)
      setFailure(true)
    }

    setTimeout(() => {
      setLoading(false)
      setMinting(false)
    }, 1000)
  }

  const connectAccount = async () => {
    setLoading(true)
    const ethereum = getEthereumAPI()
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts'
    })

    const account = accounts[0]
    console.log('Found authorized account:', account)
    setAccount(account)
    setTimeout(() => setLoading(false), 500)
  }

  const handleNFTMinted = (_, tokenID) => {
    setTokenID(tokenID)
  }

  useEffect(() => {
    checkAccountConnected()

    const contract = getContractAPI()
    contract.on('NFTMinted', handleNFTMinted)

    return () => {
      contract.off('NFTMinted', handleNFTMinted)
    }
  }, [])

  const getRaribleLink = () =>
    `https://rinkeby.rarible.com/token/${contractAddr}:${tokenID}`

  const getOpenseaLink = () =>
    `https://testnets.opensea.io/assets/${contractAddr}/${tokenID}`

  const renderAuthorization = () => (
    <div className="intro">
      <h1 className="intro-title">Welcome to Ether NFTs</h1>
      <h2 className="intro-subtitle">Dapp that creates NFTs for you</h2>
      <button className="intro-button" onClick={connectAccount}>
        Connect My Wallet 🦄
      </button>
    </div>
  )

  const renderApplication = () => (
    <div className="dapp">
      <button className="dapp-button" onClick={createNFT}>
        Mint me some NFT 🔥
      </button>
      {tokenID && (
        <div className="dapp-resources">
          <h1 className="dapp-title">Your NFT is ready 🤯</h1>
          <a
            className="dapp-resource"
            href={getRaribleLink()}
            target="_blank"
          >{getRaribleLink()}</a>
          <a
            className="dapp-resource"
            href={getOpenseaLink()}
            target="_blank"
          >{getOpenseaLink()}</a>
        </div>
      )}
      {failure && (
        <span className="dapp-failure">
          💩 happened, check browser console
        </span>
      )}
    </div>
  )

  const renderLoading = () => (
    <div className="loading">
      {minting && (
        <span className="loading-title">
          Minting NFTs 🦄
        </span>
      )}
      <div class="loading-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )

  const renderContent = () => (
    <>
      {!account
        ? renderAuthorization()
        : renderApplication()}
    </>
  )

  return (
    <div className="container">
      {loading
        ? renderLoading()
        : renderContent()}
    </div>
  )
}
