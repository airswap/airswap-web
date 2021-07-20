import styled from "styled-components/macro";
import { ThemeProps } from "../../style/themes";

export const QuoteRow = styled.div<{ theme: ThemeProps }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid black;
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

export const MakerAddress = styled.span<{ theme: ThemeProps }>`
  /* TODO: maybe replace this component with a standard typography one when
  it exists. */
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 700;
`;

export const QuotedAmount = styled.span<{ theme: ThemeProps }>`
  font-size: 1.125rem;
  line-height: 4/3;
  font-weight: 500;
`;

export const PriceInfo = styled.span<{ isBest?: boolean; isHeading?: boolean }>`
  color: ${(props) =>
    props.isHeading
      ? props.theme.colors.grey
      : props.isBest
      ? props.theme.colors.white
      : props.theme.colors.red};
  font-size: 0.75rem;
  line-height: 2;
  font-weight: 700;
  text-transform: uppercase;
`;
