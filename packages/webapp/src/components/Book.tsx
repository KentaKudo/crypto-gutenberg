import React from "react";
import { useParams } from "react-router-dom";

import Page from "./Page";

const Book = () => {
  const { id } = useParams();
  return (
    <Page>
      {" "}
      <h1>Book#{id}</h1>
    </Page>
  );
};

export default Book;
