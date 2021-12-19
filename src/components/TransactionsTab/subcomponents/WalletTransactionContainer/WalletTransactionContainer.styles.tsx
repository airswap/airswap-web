import { motion } from "framer-motion";
import styled from "styled-components/macro";

export const Container = styled(motion.div)`
  width: 100%;
  height: 4.125rem;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
  overflow: hidden;
  // transition: height 0.3s cubic-bezier(0.21, -0.01, 0.22, 1);

  & + & {
    margin-top: 0.5rem;
  }
`;
