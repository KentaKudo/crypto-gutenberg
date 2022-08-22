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
        1 // FIXME: actual.value does not return expected value
      );
      expect(actualBook.title).to.equal(input.title);
      expect(actualBook.author).to.equal(input.author);
      expect(actualBook.nrOfChapters).to.equal(input.chapters.length);
    });

    it("should store chapters", async () => {
      const actualChapters = await library.listChaptersByBookId(
        1 // FIXME: actual.value does not return expected value
      );

      expect(actualChapters).to.be.lengthOf(input.chapters.length);
      for (let i = 0; i < input.chapters.length; i++) {
        expect(actualChapters[i].title).to.equal(input.chapters[i].title);
      }
    });
  });

  context("when adding a paragraph", () => {
    let actual: ContractTransaction, library: TestLibrary;

    const book = {
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

    const input = {
      bookId: 1, // FIXME: value.toNumber() does not have expected value
      chapterIndex: 0,
      text: "親譲おやゆずりの無鉄砲むてっぽうで小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰こしを抜ぬかした事がある。なぜそんな無闇むやみをしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談じょうだんに、いくら威張いばっても、そこから飛び降りる事は出来まい。弱虫やーい。と囃はやしたからである。小使こづかいに負ぶさって帰って来た時、おやじが大きな眼めをして二階ぐらいから飛び降りて腰を抜かす奴やつがあるかと云いったから、この次は抜かさずに飛んで見せますと答えた。",
    };

    before(async () => {
      ({ library } = await loadFixture(deploy));
      await library.addBook(book);

      actual = await library.addParagraph(input);
    });

    it("should return paragraph id", () => {
      expect(actual.value).to.be.instanceOf(BigNumber);
    });

    it("should store the paragraph in storage", async () => {
      const actualParagraphs =
        await library.listParagraphsByBookIdAndChapterIndex(
          1, // FIXME: actual.value does not return expected value
          0
        );

      expect(actualParagraphs).to.be.lengthOf(1);
      expect(actualParagraphs[0].id).to.not.equal(0);
      expect(actualParagraphs[0].text).to.equal(input.text);
    });

    it("should update next paragraph index in chapter", async () => {
      const actualChapters = await library.listChaptersByBookId(
        1 // FIXME: actual.value does not return expected value
      );

      expect(actualChapters[0].nextParagraphIdx).to.equal(1);
    });
  });
});
