import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Library", () => {
  const deploy = async () => {
    const Library = await ethers.getContractFactory("Library");
    const library = await Library.deploy();

    return { library };
  };

  context("when adding a new book", () => {
    it("should add a new book", async () => {
      const { library } = await loadFixture(deploy);

      const input = {
        title: "坊ちゃん",
        author: "夏目漱石",
        chapters: [
          {
            title: "一",
            nrOfParagraphs: 10,
          },
          {
            title: "二",
            nrOfParagraphs: 11,
          },
          {
            title: "三",
            nrOfParagraphs: 12,
          },
        ],
      };

      const actual = await library.addBook(input);
      expect(actual.value).to.equal(0);
    });
  });
});
