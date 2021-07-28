import { LightOrder } from "@airswap/types";
import { FC, useState } from "react";
import { TokenInfo } from "@uniswap/token-lists";
import { MdArrowDownward } from "react-icons/md";
import { Subtitle, Title, Metadata } from "../Typography/Typography";
import { formatUnits } from "ethers/lib/utils";
import { QuoteRow } from "../QuoteComparison/QuoteComparison.styles";
import TokenLogo from "../TokenLogo/TokenLogo";
import {
  AmountAndLogoContainer,
  ArrowContainer,
  BestQuoteContainer,
  PriceContainer,
  StyledPrice,
  StyledInvertPriceButton,
  StyledInvertPriceIcon,
  InfoContainer,
  InfoRow,
} from "./FeaturedQuote.styles";
import { useTranslation } from "react-i18next";
// Note bignumber.js needed because of decimals.
import { BigNumber } from "bignumber.js";
import stringToSignificantDecimals from "../../helpers/stringToSignificantDecimals";

type FeaturedQuoteProps = {
  quote: LightOrder;
  senderTokenInfo: TokenInfo;
  signerTokenInfo: TokenInfo;
};

const FeaturedQuote: FC<FeaturedQuoteProps> = ({
  quote,
  senderTokenInfo,
  signerTokenInfo,
}) => {
  const { t } = useTranslation(["orders"]);
  const [invertPrice, setInvertPrice] = useState<boolean>(false);

  // TODO: ideally refactor out bignumber.js
  let price = new BigNumber(quote.signerAmount)
    .dividedBy(new BigNumber(quote.senderAmount))
    .dividedBy(10 ** (signerTokenInfo.decimals - senderTokenInfo.decimals));

  if (invertPrice) {
    price = new BigNumber(1).dividedBy(price);
  }

  return (
    <BestQuoteContainer>
      <QuoteRow>
        <Title type="h4">
          {formatUnits(quote.senderAmount, senderTokenInfo.decimals)}
        </Title>
        <AmountAndLogoContainer>
          <TokenLogo size="small" tokenInfo={senderTokenInfo} />
          <Subtitle>{senderTokenInfo.symbol}</Subtitle>
        </AmountAndLogoContainer>
      </QuoteRow>
      <ArrowContainer>
        <MdArrowDownward />
      </ArrowContainer>
      <QuoteRow>
        <Title type="h4">
          {stringToSignificantDecimals(
            formatUnits(quote.signerAmount, signerTokenInfo.decimals)
          )}
        </Title>
        <AmountAndLogoContainer>
          <TokenLogo size="small" tokenInfo={signerTokenInfo} />
          <Subtitle>{signerTokenInfo.symbol}</Subtitle>
        </AmountAndLogoContainer>
      </QuoteRow>

      <PriceContainer>
        <Subtitle>{t("orders:price")} &nbsp;</Subtitle>
        <StyledPrice>
          1 {invertPrice ? signerTokenInfo.symbol : senderTokenInfo.symbol} ={" "}
          {/* TODO: this can display as an exponential */}
          {stringToSignificantDecimals(price.toString())}{" "}
          {invertPrice ? senderTokenInfo.symbol : signerTokenInfo.symbol}
          <StyledInvertPriceButton onClick={() => setInvertPrice((p) => !p)}>
            <StyledInvertPriceIcon />
          </StyledInvertPriceButton>
        </StyledPrice>
      </PriceContainer>

      <InfoContainer>
        <InfoRow>
          <Metadata>{t("orders:gasCost")}</Metadata>
          {/* TODO: estimate gas */}
          <Metadata>0.000123 WETH</Metadata>
        </InfoRow>
        <InfoRow>
          {/* TODO: metadata isn't right here, missing typography component */}
          <Metadata>{t("orders:protocolFee")}</Metadata>
          {/* @ts-ignore TODO: this needs to come from the swap contract */}
          <Metadata>{parseInt(quote.signerFee) / 100}%</Metadata>
        </InfoRow>
      </InfoContainer>
    </BestQuoteContainer>
  );
};

export default FeaturedQuote;
