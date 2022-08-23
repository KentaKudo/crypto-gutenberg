import React, { useEffect, useState } from "react";
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
  Text,
} from "@chakra-ui/react";

const useBooksCount = (
  library: ethers.providers.JsonRpcProvider | undefined
) => {
  const [booksCount, setBooksCount] = useState(0);

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

      const cnt = await contract.getBooksCount();
      setBooksCount(cnt.toNumber());
    };

    fetchBooks();
  }, [library]);

  return [booksCount];
};

function App() {
  const { library } = useEthers();

  const [booksCount] = useBooksCount(library);

  return (
    <Flex direction="column" align="center" p={20} maxW="960px" m="auto">
      <Heading>Crypto Gutenberg</Heading>
      <Text>
        Crypto Guternberg is a project to store public domain books paragraph by
        paragraph as on-chain NFT token.
      </Text>
      <StatGroup>
        <Stat>
          <StatLabel># of books</StatLabel>
          <StatNumber>{booksCount}</StatNumber>
        </Stat>
      </StatGroup>
    </Flex>
  );
}

export default App;
