// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import { ILibrary } from "./interfaces/ILibrary.sol";
import { IToken } from "./interfaces/IToken.sol";

contract Token is IToken, Ownable, ERC721Enumerable {
  ILibrary public immutable _library;

  constructor(ILibrary __library)
    ERC721("Crypto Gutenberg", "CRYPTOGUTENBERG")
  {
    _library = __library;
  }

  function mint(ILibrary.Paragraph memory _paragraph) public returns (uint256) {
    uint256 paragraphId = _library.register(_paragraph);
    // store paragraphId
    _mint(msg.sender, paragraphId);
    return paragraphId;
  }
}
