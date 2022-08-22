// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import { ILibrary } from "./interfaces/ILibrary.sol";
import { IToken } from "./interfaces/IToken.sol";

contract Botchan is IToken, Ownable, ERC721Enumerable {
  ILibrary public immutable lib;

  uint256 private _bookId;
  uint256 private _currentTokenId;
  mapping(uint256 => uint256) tokenIdToParagraphId;

  constructor(ILibrary _lib) ERC721(unicode"坊ちゃん", "BOTCHAN") {
    lib = _lib;

    ILibrary.ChapterInfo[] memory chapters = new ILibrary.ChapterInfo[](11);
    chapters[0] = ILibrary.ChapterInfo({ title: unicode"一" });
    chapters[1] = ILibrary.ChapterInfo({ title: unicode"二" });
    chapters[2] = ILibrary.ChapterInfo({ title: unicode"三" });
    chapters[3] = ILibrary.ChapterInfo({ title: unicode"四" });
    chapters[4] = ILibrary.ChapterInfo({ title: unicode"五" });
    chapters[5] = ILibrary.ChapterInfo({ title: unicode"六" });
    chapters[6] = ILibrary.ChapterInfo({ title: unicode"七" });
    chapters[7] = ILibrary.ChapterInfo({ title: unicode"八" });
    chapters[8] = ILibrary.ChapterInfo({ title: unicode"九" });
    chapters[9] = ILibrary.ChapterInfo({ title: unicode"十" });
    chapters[10] = ILibrary.ChapterInfo({ title: unicode"十一" });

    ILibrary.BookInfo memory book = ILibrary.BookInfo({
      title: unicode"坊ちゃん",
      author: unicode"夏目漱石",
      chapters: chapters
    });

    _bookId = lib.addBook(book);
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
