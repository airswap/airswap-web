import styled from "styled-components/macro";
import { BsStarFill } from "react-icons/bs";

export const QuoteRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-width: 1px;
  border-style: solid;
  background-image: ${(props) => props.theme.colors.subtleBgGradient};
  /* border-image: linear-gradient(rgb(0, 143, 104), rgb(250, 224, 66)) 1; */

  border-image: ${(props) =>
    props.theme.name === "dark"
      ? "linear-gradient(90deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0)) 1"
      : "linear-gradient(90deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0)) 1"};
`;

export const QuoteList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  ${QuoteRow}:nth-child(even) {
    border-top: none;
    &:not(:last-child) {
      margin-bottom: 1rem;
    }
  }
`;

export const MakerAddress = styled.div`
  /* TODO: maybe replace this component with a standard typography one when
  it exists. */
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 700;
`;

export const StyledStar = styled(BsStarFill)`
  /* Slight adjustment needed to vertically center */
  position: relative;
  top: -1px;
  margin-left: 0.5rem;
  color: ${(props) => props.theme.colors.primary};
`;

export const QuotedAmount = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  line-height: 4/3;
  font-weight: 500;
`;

export const PriceInfo = styled.span<{ isBest?: boolean; isHeading?: boolean }>`
  color: ${(props) =>
    props.isHeading
      ? props.theme.name === "dark"
        ? props.theme.colors.lightGrey
        : props.theme.colors.grey
      : props.isBest
      ? props.theme.colors.white
      : props.theme.colors.red};
  font-size: 0.75rem;
  line-height: 2;
  font-weight: 700;
  text-transform: uppercase;
`;
