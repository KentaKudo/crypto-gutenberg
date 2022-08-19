// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { ERC721Enumerable } from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import { IToken } from "./interfaces/IToken.sol";

contract Token is IToken, Ownable, ERC721Enumerable {
    
    constructor() ERC721("Crypto Gutenberg", "CRYPTOGUTENBERG") {}

    function mint() public override returns (uint256) {
        uint256 tokenId = 123;
        _mint(msg.sender, tokenId);
        return tokenId;
    }

}
