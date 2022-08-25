// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { IArchive } from "./interfaces/IArchive.sol";

contract Archive is IArchive {
  struct Book {
    uint256 id;
    string title;
    string author;
    uint256 nrOfChapters;
  }

  struct Chapter {
    string title;
    uint256 nextParagraphIdx;
  }

  struct Paragraph {
    uint256 id;
    string text;
  }

  uint256 private _nextBookId = 1;

  // globally unique identifier for paragraphs.
  uint256 private _nextParagraphId = 1;

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
      chapters[id][i] = Chapter({
        title: _book.chapters[i].title,
        nextParagraphIdx: 0
      });
    }

    return id;
  }

  function addParagraph(ParagraphInfo memory _paragragh)
    external
    chapterExists(_paragragh.bookId, _paragragh.chapterIndex)
    returns (uint256)
  {
    uint256 id = _nextParagraphId++;

    Chapter storage chapter = chapters[_paragragh.bookId][
      _paragragh.chapterIndex
    ];
    uint256 idx = chapter.nextParagraphIdx++;

    paragraphs[_paragragh.bookId][_paragragh.chapterIndex][idx] = Paragraph({
      id: id,
      text: _paragragh.text
    });

    return id;
  }

  function getBooksCount() public view returns (uint256) {
    return _nextBookId - 1;
  }

  modifier bookExists(uint256 _id) {
    require(_id > 0 && _id < _nextBookId, "book not exists");
    _;
  }

  modifier chapterExists(uint256 _id, uint256 _idx) {
    require(_id > 0 && _id < _nextBookId, "book not exists");
    Book memory book = books[_id];
    require(_idx < book.nrOfChapters, "chapter index out of range");
    _;
  }

  function listBooks() external view returns (Book[] memory) {
    Book[] memory bs = new Book[](getBooksCount());
    for (uint256 i = 1; i <= getBooksCount(); i++) {
      bs[i - 1] = books[i];
    }

    return bs;
  }

  function getBook(uint256 _id)
    public
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
    Book memory book = getBook(_id);

    Chapter[] memory cs = new Chapter[](book.nrOfChapters);
    for (uint256 i = 0; i < book.nrOfChapters; i++) {
      cs[i] = chapters[_id][i];
    }

    return cs;
  }

  function _listParagraphsByBookIdAndChapterIndex(uint256 _id, uint256 _idx)
    internal
    view
    chapterExists(_id, _idx)
    returns (Paragraph[] memory)
  {
    Chapter memory chapter = chapters[_id][_idx];
    uint256 length = chapter.nextParagraphIdx;

    Paragraph[] memory ps = new Paragraph[](length);
    for (uint256 i = 0; i < length; i++) {
      ps[i] = paragraphs[_id][_idx][i];
    }

    return ps;
  }
}
