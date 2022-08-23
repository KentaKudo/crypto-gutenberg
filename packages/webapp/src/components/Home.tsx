import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { getContractAddresses, Archive } from "@crypto-gutenberg/contracts";
import { useEthers } from "@usedapp/core";

import {
  Flex,
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

const useBooks = (library: ethers.providers.JsonRpcProvider | undefined) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const { archive: archiveAddress } = getContractAddresses(
        parseInt(process.env.REACT_APP_CHAIN_ID ?? "")
      );

      const contract = new ethers.Contract(
        archiveAddress,
        Archive.abi,
        library
      );

      const books = await contract.listBooks();
      setBooks(books);
    };

    fetchBooks();
  }, [library]);

  return [books];
};

const Home = () => {
  const { library } = useEthers();
  const navigate = useNavigate();
  const [books] = useBooks(library);

  return (
    <Flex direction="column" align="center" p={20} maxW="960px" m="auto">
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
            {books.map(({ id, title, author }) => (
              <Tr onClick={() => navigate(`/books/${id}`)} cursor="pointer">
                <Td>{title}</Td>
                <Td>{author}</Td>
                <Td>0.00%</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default Home;
