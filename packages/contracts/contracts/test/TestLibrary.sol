// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import { Library } from "../Library.sol";

contract TestLibrary is Library {
  function getBook(uint256 _id) public view returns (Book memory) {
    return _getBook(_id);
  }

  function listChaptersByBookId(uint256 _id)
    public
    view
    returns (Chapter[] memory)
  {
    return _listChaptersByBookId(_id);
  }
}
