// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import { Archive } from "../Archive.sol";

contract TestArchive is Archive {
  function listParagraphsByBookIdAndChapterIndex(uint256 _id, uint256 _idx)
    public
    view
    returns (Paragraph[] memory)
  {
    return _listParagraphsByBookIdAndChapterIndex(_id, _idx);
  }
}
