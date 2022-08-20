// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

interface ILibrary {
  struct Book {
    uint256 id;
  }

  struct BookInfo {
    string title;
  }

  struct ParagraphInfo {
    uint256 bookId;
    uint256 chapterId;
    string text;
  }

  function addBook(BookInfo memory _book) external returns (uint256);

  function listBooks() external returns (Book[] memory);

  function getBook(uint256 _id) external returns (Book memory);

  function register(ParagraphInfo memory _paragraph) external returns (uint256);
}
