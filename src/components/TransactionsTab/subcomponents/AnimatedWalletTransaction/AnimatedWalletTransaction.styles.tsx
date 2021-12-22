import { motion } from "framer-motion";
import styled from "styled-components/macro";

import { walletTransactionHeight } from "../WalletTransaction/WalletTransaction.styles";

export const Container = styled(motion.div)`
  width: 100%;
  height: ${walletTransactionHeight};
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
  overflow: hidden;

  & + & {
    margin-top: 0.5rem;
  }
`;
