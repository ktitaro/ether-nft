//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
  using Counters for Counters.Counter;

  event NFTMinted(address sender, uint256 tokenID);

  Counters.Counter private counter;
  string[] words1 = ['fan', 'dock', 'perfect', 'decisive', 'responsible', 'land', 'reward', 'suit', 'lean'];
  string[] words2 = ['chemical', 'groovy', 'ride', 'curved', 'secret', 'swing', 'chubby', 'organic', 'immure'];
  string[] words3 = ['book', 'paint', 'contrive', 'bead', 'stranger', 'resist', 'frantic', 'apply', 'panoramic'];
  string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

  constructor() ERC721 ("SquareNFT", "SQUARE") {
    console.log("Hi there, I'm contract and I'm smart");
    console.log("I can mint NFTs");
    console.log("My balance: %d", address(this).balance);
    console.log("Have fun interacting with me :)");
  }

  function random(string memory input) internal pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(input)));
  }

  function pickRandomWord1(uint256 tokenID) public view returns (string memory) {
    uint256 randomNum = random(string(abi.encodePacked("WORDS_1", Strings.toString(tokenID))));
    uint256 randomIdx = randomNum % words1.length;
    return words1[randomIdx];
  }

  function pickRandomWord2(uint256 tokenID) public view returns (string memory) {
    uint256 randomNum = random(string(abi.encodePacked("WORDS_2", Strings.toString(tokenID))));
    uint256 randomIdx = randomNum % words2.length;
    return words2[randomIdx];
  }

  function pickRandomWord3(uint256 tokenID) public view returns (string memory) {
    uint256 randomNum = random(string(abi.encodePacked("WORDS_3", Strings.toString(tokenID))));
    uint256 randomIdx = randomNum % words3.length;
    return words3[randomIdx];
  }

  function mintNFT() public {
    uint256 tokenID = counter.current();

    string memory word1 = pickRandomWord1(tokenID);
    string memory word2 = pickRandomWord2(tokenID);
    string memory word3 = pickRandomWord3(tokenID);
    string memory combinedWord = string(abi.encodePacked(word1, word2, word3));
    string memory completeSVG = string(abi.encodePacked(baseSvg, combinedWord, "</text></svg>"));
    string memory tokenURI = string(abi.encodePacked("data:application/json;base64,",
      Base64.encode(bytes(abi.encodePacked(
        '{',
        '"name": "', combinedWord, '",',
        '"description": "WTF is going on here?",',
        '"image":"data:image/svg+xml;base64,',
        Base64.encode(bytes(completeSVG)),
        '"}'
      )))
    ));

    console.log("token URI: %s", tokenURI);

    _safeMint(msg.sender, tokenID);
    _setTokenURI(tokenID, tokenURI);
    emit NFTMinted(msg.sender, tokenID);

    counter.increment();
    console.log("An NFT #%s has been minted to %s", tokenID, msg.sender);
  }
}
