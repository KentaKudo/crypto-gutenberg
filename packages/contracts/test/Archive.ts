import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { BigNumber, ContractTransaction } from "ethers";
import { ethers } from "hardhat";

import { Archive } from "../typechain-types";

describe("Archive", () => {
  const deploy = async (): Promise<{ archive: Archive }> => {
    const Archive = await ethers.getContractFactory("Archive");
    const archive = (await Archive.deploy()) as Archive;

    return { archive };
  };

  context("when adding a new book", () => {
    let actual: ContractTransaction, archive: Archive;

    const input = {
      title: "坊ちゃん",
      author: "夏目漱石",
      chapters: [
        {
          title: "一",
          nrOfParagraphs: 12,
        },
        {
          title: "二",
          nrOfParagraphs: 34,
        },
        {
          title: "三",
          nrOfParagraphs: 56,
        },
      ],
    };

    before(async () => {
      ({ archive } = await loadFixture(deploy));
      actual = await archive.addBook(input);
    });

    it("should return the book id", async () => {
      expect(actual.value).to.be.instanceOf(BigNumber);
    });

    it("should update the number of books", async () => {
      const actualBooksCount = await archive.getBooksCount();
      expect(actualBooksCount).to.equal(1);
    });

    it("should store the book in storage", async () => {
      const actualBook = await archive.getBook(
        1 // FIXME: actual.value does not return expected value
      );
      expect(actualBook.title).to.equal(input.title);
      expect(actualBook.author).to.equal(input.author);
      expect(actualBook.nrOfChapters).to.equal(input.chapters.length);
    });

    it("should store chapters", async () => {
      const actualChapters = await archive.listChaptersByBookId(
        1 // FIXME: actual.value does not return expected value
      );

      expect(actualChapters).to.be.lengthOf(input.chapters.length);
      for (let i = 0; i < input.chapters.length; i++) {
        expect(actualChapters[i].title).to.equal(input.chapters[i].title);
        expect(actualChapters[i].nrOfParagraphs).to.equal(
          input.chapters[i].nrOfParagraphs
        );
      }
    });
  });

  context("when adding a paragraph", () => {
    let actual: ContractTransaction, archive: Archive;

    const book = {
      title: "坊ちゃん",
      author: "夏目漱石",
      chapters: [
        {
          title: "一",
          nrOfParagraphs: 12,
        },
        {
          title: "二",
          nrOfParagraphs: 34,
        },
        {
          title: "三",
          nrOfParagraphs: 56,
        },
      ],
    };

    const input = {
      bookId: 1, // FIXME: value.toNumber() does not have expected value
      chapterIndex: 0,
      index: 6,
      text: "親譲おやゆずりの無鉄砲むてっぽうで小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰こしを抜ぬかした事がある。なぜそんな無闇むやみをしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談じょうだんに、いくら威張いばっても、そこから飛び降りる事は出来まい。弱虫やーい。と囃はやしたからである。小使こづかいに負ぶさって帰って来た時、おやじが大きな眼めをして二階ぐらいから飛び降りて腰を抜かす奴やつがあるかと云いったから、この次は抜かさずに飛んで見せますと答えた。",
    };

    before(async () => {
      ({ archive } = await loadFixture(deploy));
      await archive.addBook(book);

      actual = await archive.addParagraph(input);
    });

    it("should return paragraph id", () => {
      expect(actual.value).to.be.instanceOf(BigNumber);
    });

    it("should store the paragraph in storage", async () => {
      const actualParagraphs =
        await archive.listParagraphsByBookIdAndChapterIndex(
          1, // FIXME: actual.value does not return expected value
          0
        );

      expect(actualParagraphs).to.be.lengthOf(
        book.chapters[input.chapterIndex].nrOfParagraphs
      );
      expect(actualParagraphs[input.index].id.toNumber()).to.not.equal(0);
      expect(actualParagraphs[input.index].text).to.equal(input.text);
    });

    it("should be reverted if index is out of range", async () => {
      await expect(
        archive.addParagraph({
          bookId: 1, // FIXME: value.toNumber() does not have expected value
          chapterIndex: 0,
          index: book.chapters[0].nrOfParagraphs,
          text: "blablabla",
        })
      ).to.be.revertedWith("index out of range");
    });
  });

  context("when listing books", () => {
    let actual: Archive.BookStructOutput[], archive: Archive;

    const input = [
      {
        title: "坊ちゃん",
        author: "夏目漱石",
        chapters: [
          {
            title: "一",
            nrOfParagraphs: 12,
          },
          {
            title: "二",
            nrOfParagraphs: 34,
          },
          {
            title: "三",
            nrOfParagraphs: 56,
          },
        ],
      },
      {
        title: "Winnie-the-Pooh",
        author: "A. A. Milne",
        chapters: [
          {
            title:
              "IN WHICH WE ARE INTRODUCED TO WINNIE-THE-POOH AND SOME BEES, AND THE STORIES BEGIN",
            nrOfParagraphs: 78,
          },
          {
            title: "IN WHICH POOH GOES VISITING AND GETS INTO A TIGHT PLACE",
            nrOfParagraphs: 90,
          },
          {
            title:
              "IN WHICH POOH AND PIGLET GO HUNTING AND NEARLY CATCH A WOOZLE",
            nrOfParagraphs: 12,
          },
        ],
      },
    ];

    before(async () => {
      ({ archive } = await loadFixture(deploy));
      for (const book of input) {
        await archive.addBook(book);
      }

      actual = await archive.listBooks();
    });

    it("should list books", () => {
      expect(actual).to.be.lengthOf(2);
    });
  });

  context("when listing paragraphs", () => {
    let actual: Archive.ParagraphStructOutput[], archive: Archive;

    const book = {
      title: "坊ちゃん",
      author: "夏目漱石",
      chapters: [
        {
          title: "一",
          nrOfParagraphs: 12,
        },
        {
          title: "二",
          nrOfParagraphs: 34,
        },
        {
          title: "三",
          nrOfParagraphs: 56,
        },
      ],
    };

    before(async () => {
      ({ archive } = await loadFixture(deploy));
      await archive.addBook(book);

      // add a paragraph
      await archive.addParagraph({
        bookId: 1, // FIXME: value.toNumber() does not have expected value
        chapterIndex: 0,
        index: 6,
        text: "blablabla",
      });

      actual = await archive.listParagraphsByBookIdAndChapterIndex(1, 0);
    });

    it("should return all the paragraphs including empty ones", () => {
      expect(actual).to.be.lengthOf(book.chapters[0].nrOfParagraphs);
    });

    it("should return empty paragraphs", () => {
      expect(actual[0].id.toNumber()).to.equal(0);
    });

    it("should return stored paragraph", () => {
      expect(actual[6].id.toNumber()).to.not.equal(0);
      expect(actual[6].text).to.not.be.empty;
    });
  });

  context("when returning stats for a book", () => {
    let actual: [BigNumber, BigNumber], archive: Archive;

    const book = {
      title: "坊ちゃん",
      author: "夏目漱石",
      chapters: [
        {
          title: "一",
          nrOfParagraphs: 12,
        },
        {
          title: "二",
          nrOfParagraphs: 34,
        },
        {
          title: "三",
          nrOfParagraphs: 56,
        },
      ],
    };

    before(async () => {
      ({ archive } = await loadFixture(deploy));
      await archive.addBook(book);

      for (let cidx = 0; cidx < book.chapters.length; cidx++) {
        for (let pidx = 0; pidx < 3; pidx++) {
          await archive.addParagraph({
            bookId: 1, // FIXME: value.toNumber() does not have expected value
            chapterIndex: cidx,
            index: pidx,
            text: "blablabla",
          });
        }
      }

      actual = await archive.getStatsByBookId(1);
    });

    it("should return stat numbers", () => {
      const [actualMintedCount, actualTotalCount] = actual;
      expect(actualMintedCount).to.equal(9);

      const expectedTotalCount = book.chapters.reduce(
        (acc, cur) => acc + cur.nrOfParagraphs,
        0
      );
      expect(actualTotalCount).to.equal(expectedTotalCount);
    });
  });
});
