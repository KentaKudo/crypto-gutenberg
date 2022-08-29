import React from "react";
import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

type Props = {
  bookId: number;
  contract: ethers.Contract;
  cidx: number;
  pidx: number;
  text: string;
};

const MintButton = ({ bookId, contract, cidx, pidx, text }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account, activateBrowserWallet, library } = useEthers();

  const mint = async () => {
    if (!library) {
      return;
    }

    const paragraphInfo = {
      bookId,
      chapterIndex: cidx,
      index: pidx,
      text,
    };

    const signer = contract.connect(library.getSigner());
    await signer.mint(paragraphInfo);
    // TODO: update book with minted paragraph on success
  };

  const handleClick = account ? mint : onOpen;

  return (
    <>
      <Button size="sm" flexShrink={0} onClick={handleClick}>
        Mint
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Button onClick={activateBrowserWallet}>
              Connect wallet with Metamask
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MintButton;
