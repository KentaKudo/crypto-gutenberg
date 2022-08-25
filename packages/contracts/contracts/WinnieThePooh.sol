// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import { IArchive } from "./interfaces/IArchive.sol";
import { Token } from "./Token.sol";

contract WinnieThePooh is Token {
  constructor(IArchive _archive)
    Token(_archive)
    ERC721("Winnie-the-Pooh", "WINNIETHEPOOH")
  {}

  function defineBookInfo()
    internal
    pure
    override
    returns (IArchive.BookInfo memory)
  {
    IArchive.ChapterInfo[] memory chapters = new IArchive.ChapterInfo[](10);
    chapters[0] = IArchive.ChapterInfo({
      title: "IN WHICH WE ARE INTRODUCED TO WINNIE-THE-POOH AND SOME BEES, AND THE STORIES BEGIN"
    });
    chapters[1] = IArchive.ChapterInfo({
      title: "IN WHICH POOH GOES VISITING AND GETS INTO A TIGHT PLACE"
    });
    chapters[2] = IArchive.ChapterInfo({
      title: "IN WHICH POOH AND PIGLET GO HUNTING AND NEARLY CATCH A WOOZLE"
    });
    chapters[3] = IArchive.ChapterInfo({
      title: "IN WHICH EEYORE LOSES A TAIL AND POOH FINDS ONE"
    });
    chapters[4] = IArchive.ChapterInfo({
      title: "IN WHICH PIGLET MEETS A HEFFALUMP"
    });
    chapters[5] = IArchive.ChapterInfo({
      title: "IN WHICH EEYORE HAS A BIRTHDAY AND GETS TWO PRESENTS"
    });
    chapters[6] = IArchive.ChapterInfo({
      title: "IN WHICH KANGA AND BABY ROO COME TO THE FOREST, AND PIGLET HAS A BATH"
    });
    chapters[7] = IArchive.ChapterInfo({
      title: "IN WHICH CHRISTOPHER ROBIN LEADS AN EXPOTITION TO THE NORTH POLE"
    });
    chapters[8] = IArchive.ChapterInfo({
      title: "IN WHICH PIGLET IS ENTIRELY SURROUNDED BY WATER"
    });
    chapters[9] = IArchive.ChapterInfo({
      title: "IN WHICH CHRISTOPHER ROBIN GIVES A POOH PARTY, AND WE SAY GOOD-BYE"
    });

    return
      IArchive.BookInfo({
        title: "Winnie-the-Pooh",
        author: "A.A. Milne",
        chapters: chapters
      });
  }
}
