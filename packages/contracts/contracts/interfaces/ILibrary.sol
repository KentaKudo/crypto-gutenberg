// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

interface ILibrary {
  struct Paragraph {
    string title;
    string author;
    string location;
    string text;
  }

  function register(Paragraph memory _paragraph) external returns (uint256);
}
