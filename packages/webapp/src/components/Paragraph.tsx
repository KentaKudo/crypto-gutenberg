import React from "react";
import { Text } from "@chakra-ui/react";

type Props = {
  minted: boolean;
  children: React.ReactNode;
};

const Paragraph = ({ minted, children }: Props) => {
  const attr = minted ? {} : { color: "gray.400" };
  return <Text {...attr}>{children}</Text>;
};

export default Paragraph;
