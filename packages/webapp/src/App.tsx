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

const useBookIdToCollectionSymbol = () => {
  const [bookIdToCollectionSymbol, setBookIdToCollectionSymbol] = useState<
    Record<number, string>
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
      const botchanSymbol = await botchan.symbol();
      const botchanBookId = await botchan.getBookId();
      const winnieThePoohSymbol = await winnieThePooh.symbol();
      const winnieThePoohBookId = await winnieThePooh.getBookId();

      setBookIdToCollectionSymbol({
        [botchanBookId]: botchanSymbol,
        [winnieThePoohBookId]: winnieThePoohSymbol,
      });
    };

    mapBookIdToCollectionSymbol();
  }, [botchan, winnieThePooh]);

  return [bookIdToCollectionSymbol];
};

const App = () => {
  const [bookIdToCollectionSymbol] = useBookIdToCollectionSymbol();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="books">
          <Route
            path=":id"
            element={
              <Book bookIdToCollectionSymbol={bookIdToCollectionSymbol} />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
