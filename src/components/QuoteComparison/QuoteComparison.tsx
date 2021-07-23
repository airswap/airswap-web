import { LightOrder } from "@airswap/types";
import { FC } from "react";
import { TokenInfo } from "@uniswap/token-lists";
import { utils } from "ethers";
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
  signerTokenInfo: TokenInfo;
};

const QuoteComparison: FC<QuoteComparisonProps> = ({
  quotes,
  signerTokenInfo,
}) => {
  return (
    <QuoteList>
      {quotes.map((quote) => (
        <>
          <QuoteRow>
            <MakerAddress>
              {truncateEthAddress(quote.signerWallet)}
            </MakerAddress>
            <QuotedAmount>
              {utils.formatUnits(quote.signerAmount, signerTokenInfo.decimals)}
            </QuotedAmount>
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
