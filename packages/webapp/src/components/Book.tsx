import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { useEthers } from "@usedapp/core";

import { Archive, getContractAddresses } from "@crypto-gutenberg/contracts";

import { Flex, Heading, ListItem, OrderedList, Text } from "@chakra-ui/react";

import Page from "./Page";
import Paragraph from "./Paragraph";
import MintButton from "./MintButton";

interface IBook {
  id: number;
  title: string;
  author: string;
  chapters: {
    title: string;
    paragraphs: {
      id: number;
      text: string;
    }[];
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
          const paragraphs: { id: number; text: string }[] = (
            await contract.listParagraphsByBookIdAndChapterIndex(id, idx)
          ).map(({ id, text }: { id: ethers.BigNumber; text: string }) => ({
            id: id.toNumber(),
            text,
          }));
          return { ...chapter, paragraphs };
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
  const contract = bookIdToContract[parseInt(id ?? "")];

  const [fullText, setFullText] = useState<string[][]>([]);
  useEffect(() => {
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
  }, [id, contract]);

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
            const minted = paragraphs[pidx]?.id !== 0;
            return (
              <Flex
                key={pidx}
                gap={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <Paragraph minted={!!minted}>
                  {minted ? paragraphs[pidx].text : paragraph}
                </Paragraph>
                {minted ? (
                  <Text>Minted by {"you!"}</Text>
                ) : (
                  <MintButton
                    bookId={parseInt(id ?? "")}
                    contract={contract}
                    cidx={cidx}
                    pidx={pidx}
                    text={fullText[cidx][pidx]}
                  />
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
