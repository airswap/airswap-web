import { LightOrder } from "@airswap/types";
import { FC, Fragment } from "react";
import { TokenInfo } from "@uniswap/token-lists";
import { BigNumber, utils } from "ethers";
import truncateEthAddress from "truncate-eth-address";
import {
  MakerAddress,
  PriceInfo,
  QuotedAmount,
  QuoteList,
  QuoteRow,
  StyledStar,
} from "./QuoteComparison.styles";
import TokenLogo from "../TokenLogo/TokenLogo";
import { useTranslation } from "react-i18next";

export type QuoteComparisonProps = {
  /** Array of quotes to show */
  quotes: LightOrder[];
  /** Index of best quote in `quotes` array */
  bestQuoteIndex: number;
  /** TokenInfo for signer token, used for symbol and icon */
  signerTokenInfo: TokenInfo;
};

const QuoteComparison: FC<QuoteComparisonProps> = ({
  quotes,
  bestQuoteIndex,
  signerTokenInfo,
}) => {
  const bestQuoteSignerAmount = BigNumber.from(
    quotes[bestQuoteIndex].signerAmount
  );
  const { t } = useTranslation(["orders"]);
  return (
    <QuoteList>
      {quotes.map((quote, i) => {
        const isBest = i === bestQuoteIndex;
        let priceDifference = isBest
          ? BigNumber.from(0)
          : BigNumber.from(quote.signerAmount).sub(bestQuoteSignerAmount);
        return (
          <Fragment key={quote.signerWallet}>
            <QuoteRow>
              <MakerAddress>
                {truncateEthAddress(quote.signerWallet)}
                {isBest && <StyledStar />}
              </MakerAddress>
              <QuotedAmount>
                {utils.formatUnits(
                  quote.signerAmount,
                  signerTokenInfo.decimals
                )}
                <TokenLogo tokenInfo={signerTokenInfo} size="small" />
              </QuotedAmount>
            </QuoteRow>
            <QuoteRow>
              <PriceInfo isHeading={true}>
                {t("orders:priceDifference")}
              </PriceInfo>
              <PriceInfo isBest={isBest}>
                {isBest ? (
                  t("orders:bestPrice")
                ) : (
                  <>
                    {utils.formatUnits(
                      priceDifference,
                      signerTokenInfo.decimals
                    )}
                    <span>&nbsp;{signerTokenInfo.symbol}</span>
                  </>
                )}
              </PriceInfo>
            </QuoteRow>
          </Fragment>
        );
      })}
    </QuoteList>
  );
};

export default QuoteComparison;
