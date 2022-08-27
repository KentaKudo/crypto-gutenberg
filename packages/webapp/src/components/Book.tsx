import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { useEthers } from "@usedapp/core";

import { Archive, getContractAddresses } from "@crypto-gutenberg/contracts";

import Page from "./Page";
import { Heading, ListItem, OrderedList, Text } from "@chakra-ui/react";

interface IBook {
  id: number;
  title: string;
  author: string;
  chapters: {
    title: string;
    paragraphs: string[];
  }[];
}

const useBook = (id: number) => {
  const { library } = useEthers();
  const [book, setBook] = useState<IBook>();

  const { archive: archiveAddress } = getContractAddresses(
    parseInt(process.env.REACT_APP_CHAIN_ID ?? "")
  );

  const contract = useMemo(
    () => new ethers.Contract(archiveAddress, Archive.abi, library),
    [archiveAddress, library]
  );

  useEffect(() => {
    const fetchBook = async () => {
      const book = await contract.getBook(id);

      const chapters = await Promise.all(
        (
          await contract.listChaptersByBookId(book.id)
        ).map(async (chapter: { title: string }, idx: number) => {
          const paragraphs: { text: string }[] =
            await contract.listParagraphsByBookIdAndChapterIndex(id, idx);
          return { ...chapter, paragraphs: paragraphs.map(({ text }) => text) };
        })
      );

      setBook({ ...book, chapters });
    };

    fetchBook();
  }, [contract, id]);

  return [book];
};

type Props = {
  bookIdToCollectionSymbol: Record<number, string>;
};

const Book = ({ bookIdToCollectionSymbol }: Props) => {
  const { id } = useParams();

  const [fullText, setFullText] = useState<string[][]>([]);
  useEffect(() => {
    const symbol = bookIdToCollectionSymbol[parseInt(id ?? "")];
    if (!symbol) {
      return;
    }

    import(`../books/${symbol}.json`)
      .then(({ chapters }) => chapters)
      .then(setFullText)
      .catch(console.error);
  }, [id, bookIdToCollectionSymbol]);

  const [book] = useBook(parseInt(id ?? ""));
  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <Page>
      <Heading>{book.title}</Heading>
      <Text>{book.author}</Text>
      <OrderedList>
        {book.chapters?.map(({ title }, idx) => (
          <ListItem key={idx}>{title}</ListItem>
        ))}
      </OrderedList>
      {book.chapters?.map(({ title }, idx) => (
        <section key={idx}>
          <Heading size="lg">{title}</Heading>
          {fullText[idx]?.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </section>
      ))}
    </Page>
  );
};

export default Book;
