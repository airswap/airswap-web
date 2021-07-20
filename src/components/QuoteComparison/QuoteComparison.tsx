import { LightOrder } from "@airswap/types";
import { FC } from "react";
import truncateEthAddress from "truncate-eth-address";
import {
  MakerAddress,
  PriceInfo,
  QuotedAmount,
  QuoteList,
  QuoteRow,
} from "./QuoteComparison.styles";

export type QuoteComparisonProps = {
  quotes: LightOrder[];
};

const QuoteComparison: FC<QuoteComparisonProps> = ({ quotes }) => {
  return (
    <QuoteList>
      {quotes.map((quote) => (
        <>
          <QuoteRow>
            <MakerAddress>
              {truncateEthAddress(quote.signerWallet)}
            </MakerAddress>
            <QuotedAmount>11.234</QuotedAmount>
          </QuoteRow>
          <QuoteRow>
            <PriceInfo isHeading={true}>Price difference</PriceInfo>
            <PriceInfo isBest={true}>Best Price</PriceInfo>
          </QuoteRow>
        </>
      ))}
    </QuoteList>
  );
};

export default QuoteComparison;
