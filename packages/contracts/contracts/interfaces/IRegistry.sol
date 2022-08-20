// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

interface IRegistry {
  struct ParagraphInfo {
    uint256 bookId;
    uint256 chapterId;
    string text;
  }

  function register(ParagraphInfo memory _paragraph) external returns (uint256);
}
