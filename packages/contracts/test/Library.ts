import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { BigNumber, ContractTransaction } from "ethers";
import { ethers } from "hardhat";

import { TestLibrary } from "../typechain-types";

describe("Library", () => {
  const deploy = async () => {
    const Library = await ethers.getContractFactory("TestLibrary");
    const library = await Library.deploy();

    return { library };
  };

  context("when adding a new book", () => {
    let actual: ContractTransaction, library: TestLibrary;

    const input = {
      title: "坊ちゃん",
      author: "夏目漱石",
      chapters: [
        {
          title: "一",
        },
        {
          title: "二",
        },
        {
          title: "三",
        },
      ],
    };

    before(async () => {
      ({ library } = await loadFixture(deploy));
      actual = await library.addBook(input);
    });

    it("should return the book id", async () => {
      expect(actual.value).to.be.instanceOf(BigNumber);
    });

    it("should update the number of books", async () => {
      const actualBooksCount = await library.getBooksCount();
      expect(actualBooksCount).to.equal(1);
    });

    it("should store the book in storage", async () => {
      const actualBook = await library.getBook(
        1 // TODO: actual.value does not return expected value
      );
      expect(actualBook.title).to.equal(input.title);
      expect(actualBook.author).to.equal(input.author);
      expect(actualBook.nrOfChapters).to.equal(input.chapters.length);
    });

    it("should store chapters", async () => {
      const actualChapters = await library.listChaptersByBookId(
        1 // TODO: actual.value does not return expected value
      );

      expect(actualChapters).to.be.lengthOf(3);
      for (let i = 0; i < input.chapters.length; i++) {
        expect(actualChapters[i].title).to.equal(input.chapters[i].title);
      }
    });
  });
});
