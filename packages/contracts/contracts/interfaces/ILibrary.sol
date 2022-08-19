// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

interface ILibrary {
  struct BookInfo {
    string title;
    string author;
  }

  struct SectionInfo {
    uint256 bookId;
    string title;
  }

  struct ParagraphInfo {
    uint256 bookId;
    uint256 sectionId;
    string text;
  }

  function registerBook(BookInfo memory _book) external returns (uint256);

  function registerSection(SectionInfo memory _section)
    external
    returns (uint256);

  function registerParagraph(ParagraphInfo memory _paragraph)
    external
    returns (uint256);
}
