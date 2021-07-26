import styled from "styled-components/macro";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { Paragraph, Subtitle } from "../Typography/Typography";

export const BestQuoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const AmountAndLogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
`;

export const ArrowContainer = styled.div`
  align-self: center;
  /* TODO: needs theme colour once confirmed. */
  background-color: ${(props) => props.theme.colors.black};
  z-index: 1;
  padding: 0.5rem;
  margin: -0.5rem 0;
  border: 1px solid
    ${(props) => (props.theme.name === "dark" ? "#282828" : "#ededed")};
`;

export const PriceContainer = styled.div`
  align-self: center;
  margin: 1.5rem 0;
  display: flex;
  flex-direction: row;
  ${Subtitle} {
    text-transform: none;
  }
`;

export const StyledPrice = styled(Paragraph)`
  display: flex;
  flex-direction: row;
  align-items: center;
  /* TODO: not in theme. */
  color: ${(props) => (props.theme.name === "dark" ? "#9e9e9e" : "#9e9e9e")};
  font-weight: 500;
`;

export const StyledInvertPriceButton = styled.button`
  margin-left: 0.5rem;
`;

export const StyledInvertPriceIcon = styled(CgArrowsExchangeAlt)`
  font-size: 1.333333rem;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid
    ${(props) => (props.theme.name === "dark" ? "#282828" : "#ededed")};
  text-transform: uppercase;
`;

export const InfoRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
