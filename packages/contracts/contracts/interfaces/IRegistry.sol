// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

interface IRegistry {
  struct BookInfo {
    string title;
    string author;
  }

  struct ChapterInfo {
    uint256 bookId;
    string title;
  }

  struct ParagraphInfo {
    uint256 bookId;
    uint256 chapterId;
    string text;
  }

  function registerBook(BookInfo memory _book) external returns (uint256);

  function registerChapter(ChapterInfo memory _chapter)
    external
    returns (uint256);

  function registerParagraph(ParagraphInfo memory _paragraph)
    external
    returns (uint256);
}
