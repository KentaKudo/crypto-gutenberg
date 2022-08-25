import { Flex } from "@chakra-ui/react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Page = ({ children }: Props) => {
  return (
    <Flex direction="column" align="center" p={20} maxW="960px" m="auto">
      {children}
    </Flex>
  );
};

export default Page;
