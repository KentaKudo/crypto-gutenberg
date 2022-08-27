import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { useEthers } from "@usedapp/core";

import { Archive, getContractAddresses } from "@crypto-gutenberg/contracts";

import {
  Button,
  Flex,
  Heading,
  ListItem,
  OrderedList,
  Text,
} from "@chakra-ui/react";

import Page from "./Page";
import Paragraph from "./Paragraph";

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
  bookIdToContract: Record<number, ethers.Contract>;
};

const Book = ({ bookIdToContract }: Props) => {
  const { id } = useParams();

  const [fullText, setFullText] = useState<string[][]>([]);
  useEffect(() => {
    const contract = bookIdToContract[parseInt(id ?? "")];
    if (!contract) {
      return;
    }

    const loadFullText = async () => {
      const symbol = await contract.symbol();

      import(`../books/${symbol}.json`)
        .then(({ chapters }) => chapters)
        .then(setFullText)
        .catch(console.error);
    };

    loadFullText();
  }, [id, bookIdToContract]);

  const [book] = useBook(parseInt(id ?? ""));
  if (!book) {
    return <p>Loading...</p>;
  }

  const onMint = (cidx: number, pidx: number) => {
    const paragraphInfo = {
      bookId: parseInt(id ?? ""),
      chapterIndex: cidx,
      text: fullText[cidx][pidx],
    };

    console.log(`paragraphInfo: ${JSON.stringify(paragraphInfo)}`);
  };

  return (
    <Page>
      <Heading>{book.title}</Heading>
      <Text>{book.author}</Text>
      <OrderedList>
        {book.chapters?.map(({ title }, idx) => (
          <ListItem key={idx}>
            <a href={`#${title}`}>{title}</a>
          </ListItem>
        ))}
      </OrderedList>
      {book.chapters?.map(({ title, paragraphs }, cidx) => (
        <section key={cidx}>
          <Heading id={title} size="lg">
            {title}
          </Heading>
          {fullText[cidx]?.map((paragraph, pidx) => {
            const minted = paragraphs[pidx];
            return (
              <Flex key={pidx} gap={2} alignItems="center">
                <Paragraph minted={!!minted}>{minted ?? paragraph}</Paragraph>
                {minted ? (
                  <Text>Minted by {"me!"}</Text>
                ) : (
                  <Button
                    onClick={() => onMint(cidx, pidx)}
                    size="sm"
                    flexShrink={0}
                  >
                    mint
                  </Button>
                )}
              </Flex>
            );
          })}
        </section>
      ))}
    </Page>
  );
};

export default Book;
