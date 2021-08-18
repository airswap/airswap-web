import { IoMdSwap } from "react-icons/io";

import styled from "styled-components/macro";

export const StyledInvertPriceButton = styled.button`
  margin-left: 0.5rem;
`;

export const StyledInvertPriceIcon = styled(IoMdSwap)`
  position: relative;
  top: 0.4rem;
  margin-top: -0.5rem;
  font-size: 1.5rem;
`;

export const TimerContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.25rem 1.5rem;
  margin-top: 0.875rem;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 1rem;
`;

export const NewQuoteText = styled.span`
  font-size: 0.75rem;
  line-height: 2;
  font-weight: 700;
  text-transform: uppercase;
`;

export const TimerText = styled(NewQuoteText)`
  /* Fixed width to prevent jumping around as timer reduces */
  width: 2rem;
  color: ${(props) =>
    props.theme.name === "dark"
      ? props.theme.colors.white
      : props.theme.colors.primary};
  margin-left: 0.25rem;
`;
