// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import { IRegistry } from "./interfaces/IRegistry.sol";

contract Registry is IRegistry {
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

  uint256 private _currentParagraphId;
  Book[] private books;

  function register(ParagraphInfo memory _paragragh)
    external
    pure
    returns (uint256)
  {
    return 1;
  }
}
