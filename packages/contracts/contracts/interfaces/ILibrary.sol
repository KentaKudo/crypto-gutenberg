// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

interface ILibrary {
  struct BookInfo {
    string title;
    string author;
    ChapterInfo[] chapters;
  }

  struct ChapterInfo {
    string title;
  }

  struct ParagraphInfo {
    uint256 bookId;
    uint256 chapterIndex;
    string text;
  }

  function addBook(BookInfo memory _book) external returns (uint256);

  function addParagraph(ParagraphInfo memory _paragraph)
    external
    returns (uint256);
}
