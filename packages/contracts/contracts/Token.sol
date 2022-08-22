// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import { ILibrary } from "./interfaces/ILibrary.sol";
import { IToken } from "./interfaces/IToken.sol";

abstract contract Token is IToken, Ownable, ERC721Enumerable {
  ILibrary public immutable lib;

  uint256 private immutable _bookId;
  uint256 private _currentTokenId;
  mapping(uint256 => uint256) private tokenIdToParagraphId;

  constructor(ILibrary _lib) {
    lib = _lib;
    _bookId = lib.addBook(defineBookInfo());
  }

  function mint(ILibrary.ParagraphInfo memory _paragraph)
    public
    returns (uint256)
  {
    _paragraph.bookId = _bookId;
    uint256 paragraphId = lib.addParagraph(_paragraph);
    uint256 tokenId = _currentTokenId++;
    tokenIdToParagraphId[tokenId] = paragraphId;
    _mint(msg.sender, tokenId);
    return tokenId;
  }

  function defineBookInfo() internal virtual returns (ILibrary.BookInfo memory);
}
