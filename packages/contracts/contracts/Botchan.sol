// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import { IArchive } from "./interfaces/IArchive.sol";
import { Token } from "./Token.sol";

contract Botchan is Token {
  constructor(IArchive _archive)
    Token(_archive)
    ERC721(unicode"坊ちゃん", "BOTCHAN")
  {}

  function defineBookInfo()
    internal
    pure
    override
    returns (IArchive.BookInfo memory)
  {
    IArchive.ChapterInfo[] memory chapters = new IArchive.ChapterInfo[](11);
    chapters[0] = IArchive.ChapterInfo({
      title: unicode"一",
      nrOfParagraphs: 22
    });
    chapters[1] = IArchive.ChapterInfo({
      title: unicode"二",
      nrOfParagraphs: 13
    });
    chapters[2] = IArchive.ChapterInfo({
      title: unicode"三",
      nrOfParagraphs: 8
    });
    chapters[3] = IArchive.ChapterInfo({
      title: unicode"四",
      nrOfParagraphs: 21
    });
    chapters[4] = IArchive.ChapterInfo({
      title: unicode"五",
      nrOfParagraphs: 33
    });
    chapters[5] = IArchive.ChapterInfo({
      title: unicode"六",
      nrOfParagraphs: 41
    });
    chapters[6] = IArchive.ChapterInfo({
      title: unicode"七",
      nrOfParagraphs: 67
    });
    chapters[7] = IArchive.ChapterInfo({
      title: unicode"八",
      nrOfParagraphs: 80
    });
    chapters[8] = IArchive.ChapterInfo({
      title: unicode"九",
      nrOfParagraphs: 51
    });
    chapters[9] = IArchive.ChapterInfo({
      title: unicode"十",
      nrOfParagraphs: 38
    });
    chapters[10] = IArchive.ChapterInfo({
      title: unicode"十一",
      nrOfParagraphs: 100
    });

    return
      IArchive.BookInfo({
        title: unicode"坊ちゃん",
        author: unicode"夏目漱石",
        chapters: chapters
      });
  }
}
