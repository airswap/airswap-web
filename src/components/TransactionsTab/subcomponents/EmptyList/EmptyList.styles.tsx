import { motion } from "framer-motion";
import styled from "styled-components/macro";

export const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-block-start: 1rem;
  height: 4.5rem;
  color: ${(props) => props.theme.colors.lightGrey};
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  width: 2.5rem;
  min-height: 2.5rem;
  background-color: rgb(110, 118, 134, 0.1);
  color: ${(props) => props.theme.colors.lightGrey};
  border-radius: 50%;
`;
