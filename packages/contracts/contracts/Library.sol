// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { ILibrary } from "./interfaces/ILibrary.sol";

contract Library is ILibrary {
  struct Book {
    string title;
    string author;
    uint256 nrOfChapters;
  }

  struct Chapter {
    string title;
    uint256 nrOfParagraphs;
  }

  struct Paragraph {
    uint256 id;
    string text;
  }

  uint256 private _nextBookId;

  // globally unique identifier for paragraphs.
  uint256 private _nextParagraphId;

  mapping(uint256 => Book) private books;

  mapping(uint256 => mapping(uint256 => Chapter)) chapters;

  mapping(uint256 => mapping(uint256 => mapping(uint256 => Paragraph))) paragraphs;

  function addBook(BookInfo memory _book) external returns (uint256) {
    uint256 id = _nextBookId++;

    books[id] = Book({
      title: _book.title,
      author: _book.author,
      nrOfChapters: _book.chapters.length
    });

    for (uint256 i = 0; i < _book.chapters.length; i++) {
      chapters[id][i] = Chapter({
        title: _book.chapters[i].title,
        nrOfParagraphs: _book.chapters[i].nrOfParagraphs
      });
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
