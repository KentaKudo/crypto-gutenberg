// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import { ILibrary } from "./interfaces/ILibrary.sol";

contract Library is ILibrary {
  struct Book {
    string title;
    string author;
    Chapter[] chapters;
  }

  uint256 private nextBookIndex = 1;

  struct Chapter {
    string title;
    string[] paragraphs;
  }

  mapping(uint256 => Book) private books;

  function registerBook(BookInfo memory _book) external pure returns (uint256) {
    return 1;
  }

  function registerChapter(ChapterInfo memory _chapter)
    external
    pure
    returns (uint256)
  {
    return 1;
  }

  function registerParagraph(ParagraphInfo memory _paragragh)
    external
    pure
    returns (uint256)
  {
    return 1;
  }
}
