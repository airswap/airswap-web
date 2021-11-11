import { motion } from "framer-motion";
import styled from "styled-components/macro";

export const Track = styled.div`
  width: 100%;
  height: 0.25rem;
  background-color: ${(props) => props.theme.colors.borderGrey};
  border-radius: 0.1875rem;
  overflow: hidden;
`;

export const Progress = styled(motion.div)`
  height: 100%;
  width: 100%;
  background-color: ${(props) => props.theme.colors.primary};
  transform-origin: left;
`;
