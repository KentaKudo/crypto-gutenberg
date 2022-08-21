// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { ILibrary } from "./interfaces/ILibrary.sol";

contract Library is ILibrary {
  struct Book {
    uint256 id;
    string title;
    string author;
    uint256 nrOfChapters;
  }

  struct Chapter {
    string title;
  }

  struct Paragraph {
    uint256 id;
    string text;
  }

  uint256 private _nextBookId = 1;

  // globally unique identifier for paragraphs.
  uint256 private _nextParagraphId;

  mapping(uint256 => Book) private books;

  mapping(uint256 => mapping(uint256 => Chapter)) private chapters;

  mapping(uint256 => mapping(uint256 => mapping(uint256 => Paragraph)))
    private paragraphs;

  function addBook(BookInfo memory _book) external returns (uint256) {
    uint256 id = _nextBookId++;

    books[id] = Book({
      id: id,
      title: _book.title,
      author: _book.author,
      nrOfChapters: _book.chapters.length
    });

    for (uint256 i = 0; i < _book.chapters.length; i++) {
      chapters[id][i] = Chapter({ title: _book.chapters[i].title });
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

  function getBooksCount() external view returns (uint256) {
    return _nextBookId - 1;
  }

  modifier bookExists(uint256 _id) {
    require(_id > 0 && _id < _nextBookId, "book not exists");
    _;
  }

  function _getBook(uint256 _id)
    internal
    view
    bookExists(_id)
    returns (Book memory)
  {
    return books[_id];
  }

  function _listChaptersByBookId(uint256 _id)
    internal
    view
    bookExists(_id)
    returns (Chapter[] memory)
  {
    Book memory book = _getBook(_id);

    Chapter[] memory cs = new Chapter[](book.nrOfChapters);
    for (uint256 i = 0; i < book.nrOfChapters; i++) {
      cs[i] = chapters[_id][i];
    }

    return cs;
  }
}
