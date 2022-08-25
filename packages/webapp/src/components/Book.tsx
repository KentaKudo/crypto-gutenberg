import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { BigNumber, ethers } from "ethers";
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
      const chapters: { title: string }[] = await contract.listChaptersByBookId(
        book.id
      );

      setBook({ ...book, chapters });
    };

    fetchBook();
  }, [contract, id]);

  return [book];
};

const Book = () => {
  const { id } = useParams();

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
    </Page>
  );
};

export default Book;
