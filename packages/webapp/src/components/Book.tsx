import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { useEthers } from "@usedapp/core";

import { Archive, getContractAddresses } from "@crypto-gutenberg/contracts";

import Page from "./Page";
import { Heading, Text } from "@chakra-ui/react";

const useBook = (id: number) => {
  const { library } = useEthers();
  const [book, setBook] = useState();

  useEffect(() => {
    const fetchBook = async () => {
      const { archive: archiveAddress } = getContractAddresses(
        parseInt(process.env.REACT_APP_CHAIN_ID ?? "")
      );

      const contract = new ethers.Contract(
        archiveAddress,
        Archive.abi,
        library
      );

      const book = await contract.getBook(id);
      setBook(book);
    };

    fetchBook();
  });

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
    </Page>
  );
};

export default Book;
