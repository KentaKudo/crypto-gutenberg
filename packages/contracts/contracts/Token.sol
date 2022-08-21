// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import { ILibrary } from "./interfaces/ILibrary.sol";
import { IToken } from "./interfaces/IToken.sol";

contract Token is IToken, Ownable, ERC721Enumerable {
  ILibrary public immutable lib;

  uint256 private _currentTokenId;
  mapping(uint256 => uint256) tokenIdToParagraphId;

  constructor(ILibrary _lib) ERC721("Crypto Gutenberg", "CRYPTOGUTENBERG") {
    lib = _lib;
  }

  function mint(ILibrary.ParagraphInfo memory _paragraph)
    public
    returns (uint256)
  {
    uint256 paragraphId = lib.addParagraph(_paragraph);
    uint256 tokenId = _currentTokenId++;
    tokenIdToParagraphId[tokenId] = paragraphId;
    _mint(msg.sender, tokenId);
    return tokenId;
  }
}
