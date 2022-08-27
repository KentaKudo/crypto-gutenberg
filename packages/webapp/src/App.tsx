import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";

import {
  Botchan,
  getContractAddresses,
  WinnieThePooh,
} from "@crypto-gutenberg/contracts";

import Book from "./components/Book";
import Home from "./components/Home";

const useBookIdToContract = () => {
  const [bookIdToContract, setBookIdToContract] = useState<
    Record<number, ethers.Contract>
  >({});

  const { library } = useEthers();

  const { botchan: botchanAddress, winnieThePooh: winnieThePoohAddress } =
    getContractAddresses(parseInt(process.env.REACT_APP_CHAIN_ID ?? ""));

  const botchan = useMemo(
    () => new ethers.Contract(botchanAddress, Botchan.abi, library),
    [library, botchanAddress]
  );

  const winnieThePooh = useMemo(
    () => new ethers.Contract(winnieThePoohAddress, WinnieThePooh.abi, library),
    [library, winnieThePoohAddress]
  );

  useEffect(() => {
    const mapBookIdToCollectionSymbol = async () => {
      const botchanBookId = await botchan.getBookId();
      const winnieThePoohBookId = await winnieThePooh.getBookId();

      setBookIdToContract({
        [botchanBookId]: botchan,
        [winnieThePoohBookId]: winnieThePooh,
      });
    };

    mapBookIdToCollectionSymbol();
  }, [botchan, winnieThePooh]);

  return [bookIdToContract];
};

const App = () => {
  const [bookIdToContract] = useBookIdToContract();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="books">
          <Route
            path=":id"
            element={<Book bookIdToContract={bookIdToContract} />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
