// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { ILibrary } from "./interfaces/ILibrary.sol";

contract Library is ILibrary {
  struct Book {
    string title;
    string author;
    Chapter[] chapters;
  }

  struct Chapter {
    string title;
    Paragraph[] paragraphs;
  }

  struct Paragraph {
    uint256 id;
    string text;
  }

  uint256 private _nextBookId = 1; // 0 indicates null value
  uint256 private _currentParagraphId;
  mapping(uint256 => Book) private books;

  function addBook(BookInfo memory _book) external returns (uint256) {
    uint256 id = _nextBookId++;

    Book storage book = books[id];
    book.title = _book.title;
    book.author = _book.author;

    for (uint256 i = 0; i < _book.chapters.length; i++) {
      Chapter memory chapter;
      chapter.title = _book.chapters[i];

      book.chapters.push(chapter);
    }

    return id;
  }

  function addParagraph(ParagraphInfo memory _paragragh)
    external
    pure
    returns (uint256)
  {
    return 1;
  }
}
