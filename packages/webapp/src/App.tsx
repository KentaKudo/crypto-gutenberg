import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Book from "./components/Book";
import Home from "./components/Home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="books">
          <Route path=":id" element={<Book />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
