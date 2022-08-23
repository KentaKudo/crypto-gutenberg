import React, { useEffect } from "react";
import { ethers } from "ethers";

import { getContractAddresses, Library } from "@crypto-gutenberg/contracts";

function App() {
  // const connectWallet = async () => {
  //   try {
  //     // @ts-ignore
  //     const { ethereum } = window;

  //     if (!ethereum) {
  //       alert("Please install MetaMask!");
  //       return;
  //     }

  //     const accounts = await ethereum.request({
  //       method: "eth_requestAccounts",
  //     });

  //     console.log("Connected", accounts[0]);
  //     fetchBooks(ethereum);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const fetchBooks = async () => {
    const { library: libraryAddress } = getContractAddresses(
      parseInt(process.env.REACT_APP_CHAIN_ID ?? "")
    );

    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(libraryAddress, Library.abi, provider);

    const cnt = await contract.getBooksCount();
    console.log(`books count: ${cnt}`);
  };

  useEffect(() => {
    // connectWallet();
    fetchBooks();
  }, []);

  return <div></div>;
}

export default App;
