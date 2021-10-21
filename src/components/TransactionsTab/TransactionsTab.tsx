import { useState } from "react";

import { Container, BackgroundOverlay } from "./TransactionsTab.styles";

type TransactionsTabType = {
  open: boolean;
};

const TransactionsTab = ({ open }: TransactionsTabType) => {
  return (
    <>
      <BackgroundOverlay open={open} />
      <Container open={open}></Container>
    </>
  );
};

export default TransactionsTab;
