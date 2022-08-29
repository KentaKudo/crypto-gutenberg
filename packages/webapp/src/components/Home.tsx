import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { getContractAddresses, Archive } from "@crypto-gutenberg/contracts";
import { useEthers } from "@usedapp/core";

import {
  Heading,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Text,
  Th,
  Thead,
  Tr,
  Tbody,
  Td,
} from "@chakra-ui/react";

import Page from "./Page";

type Book = {
  id: number;
  title: string;
  author: string;
  totalParagraphsCount: number;
  mintedParagraphsCount: number;
};

const useBooks = () => {
  const { library } = useEthers();
  const [books, setBooks] = useState<Book[]>([]);

  const { archive: archiveAddress } = getContractAddresses(
    parseInt(process.env.REACT_APP_CHAIN_ID ?? "")
  );

  const contract = useMemo(
    () => new ethers.Contract(archiveAddress, Archive.abi, library),
    [library, archiveAddress]
  );

  useEffect(() => {
    const fetchBooks = async () => {
      const books = await Promise.all(
        (
          await contract.listBooks()
        ).map(async (book: Book) => {
          const [mintedParagraphsCount, totalParagraphsCount] =
            await contract.getStatsByBookId(book.id);

          return {
            ...book,
            totalParagraphsCount,
            mintedParagraphsCount,
          };
        })
      );

      setBooks(books);
    };

    fetchBooks();
  }, [contract]);

  return [books];
};

const Home = () => {
  const navigate = useNavigate();
  const [books] = useBooks();

  return (
    <Page>
      <Heading>Crypto Gutenberg</Heading>
      <Text>
        Crypto Guternberg is a project to store public domain books in
        blockchain paragraph by paragraph as on-chain NFT token.
      </Text>
      <Text>Each book is a NFT collection.</Text>
      <StatGroup display="flex" flexDirection="column">
        <Stat>
          <StatLabel># of books</StatLabel>
          <StatNumber>{books.length}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>
            # of books all the paragraphs of which is stored on blockchain
          </StatLabel>
          <StatNumber>0</StatNumber>
        </Stat>
      </StatGroup>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Author</Th>
              <Th isNumeric>Completion rate</Th>
            </Tr>
          </Thead>
          <Tbody>
            {books.map(
              ({
                id,
                title,
                author,
                mintedParagraphsCount,
                totalParagraphsCount,
              }) => {
                const completionRate =
                  (mintedParagraphsCount * 100.0) / totalParagraphsCount;
                return (
                  <Tr
                    key={id}
                    onClick={() => navigate(`/books/${id}`)}
                    cursor="pointer"
                  >
                    <Td>{title}</Td>
                    <Td>{author}</Td>
                    <Td>
                      {completionRate.toFixed(2)}
                      {isNaN(completionRate) ? "" : "%"}
                    </Td>
                  </Tr>
                );
              }
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Page>
  );
};

export default Home;
