// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import { ILibrary } from "./interfaces/ILibrary.sol";
import { Token } from "./Token.sol";

contract Botchan is Token {
  constructor(ILibrary _lib) Token(_lib) ERC721(unicode"坊ちゃん", "BOTCHAN") {}

  function defineBookInfo()
    internal
    pure
    override
    returns (ILibrary.BookInfo memory)
  {
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

    return
      ILibrary.BookInfo({
        title: unicode"坊ちゃん",
        author: unicode"夏目漱石",
        chapters: chapters
      });
  }
}
