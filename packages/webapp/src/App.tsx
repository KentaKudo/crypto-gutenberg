import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { getContractAddresses, Archive } from "@crypto-gutenberg/contracts";
import { useEthers } from "@usedapp/core";

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
  const {
    account,
    active,
    activateBrowserWallet,
    chainId,
    deactivate,
    error,
    library,
  } = useEthers();

  const [booksCount] = useBooksCount(library);

  return (
    <>
      <h1>Crypto Gutenberg</h1>
      <div>Connection Status: {active ? "Connected" : "Disconnected"}</div>
      <div>Account: {account}</div>
      <div>Network ID: {chainId}</div>
      {account ? (
        <button onClick={() => deactivate()}>Disconnect</button>
      ) : (
        <button onClick={() => activateBrowserWallet()}>
          Connect with Metamask
        </button>
      )}
      {error && <p>{JSON.stringify(error)}</p>}
      <p>Books count: {booksCount}</p>
    </>
  );
}

export default App;
