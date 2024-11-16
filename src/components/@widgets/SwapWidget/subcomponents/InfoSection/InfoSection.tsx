import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/utils";

import { BigNumber } from "bignumber.js";

import { PricingErrorType } from "../../../../../errors/pricingError";
import stringToSignificantDecimals from "../../../../../helpers/stringToSignificantDecimals";
import Icon from "../../../../Icon/Icon";
import { InfoSubHeading } from "../../../../Typography/Typography";
import ClearServerButton from "../ClearServerButton/ClearServerButton";
import PricingErrorInfo from "../PricingErrorInfo/PricingErrorInfo";
import {
  RevertPriceButton,
  StyledInfoHeading,
  StyledLargePillButton,
} from "./InfoSection.styles";

export type InfoSectionProps = {
  failedToFetchAllowances: boolean;
  hasSelectedCustomServer: boolean;
  isConnected: boolean;
  isFetchingOrders: boolean;
  isNetworkUnsupported: boolean;
  pricingError?: PricingErrorType;
  quoteTokenInfo: TokenInfo | null;
  baseTokenInfo: TokenInfo | null;
  baseAmount: string;
  bestQuote?: string;
  serverUrl: string | null;
  // TODO: Enable these once we reinstate these features
  // showViewAllQuotes: boolean;
  // onClearServerUrlButtonClick: () => void;
  // onViewAllQuotesButtonClick: () => void;
};

const InfoSection: FC<InfoSectionProps> = ({
  failedToFetchAllowances,
  hasSelectedCustomServer,
  isConnected,
  isFetchingOrders,
  isNetworkUnsupported,
  pricingError,
  baseTokenInfo,
  baseAmount,
  bestQuote,
  quoteTokenInfo,
  serverUrl,
}) => {
  const { t } = useTranslation();
  const [invertPrice, setInvertPrice] = useState<boolean>(false);

  if (!isConnected) {
    return (
      <StyledInfoHeading>{t("marketing.welcomeMessage")}</StyledInfoHeading>
    );
  }

  if (isNetworkUnsupported) {
    return (
      <StyledInfoHeading>{t("wallet.unsupportedNetwork")}</StyledInfoHeading>
    );
  }

  if (failedToFetchAllowances) {
    return (
      <>
        <StyledInfoHeading>
          {t("balances.failedToFetchAllowances")}
        </StyledInfoHeading>
      </>
    );
  }

  if (isConnected && failedToFetchAllowances && !!bestQuote) {
    return (
      <StyledInfoHeading>
        {t("balances.failedToFetchAllowances")}
      </StyledInfoHeading>
    );
  }

  if (isFetchingOrders) {
    return (
      <>
        <StyledInfoHeading>{t("orders.findingBestPrice")}</StyledInfoHeading>
      </>
    );
  }

  if (pricingError) {
    return (
      <>
        <PricingErrorInfo pricingError={pricingError} />
      </>
    );
  }

  if (bestQuote) {
    let price = new BigNumber(bestQuote).dividedBy(baseAmount);

    if (invertPrice) {
      price = new BigNumber(1).dividedBy(price);
    }

    return (
      <StyledInfoHeading>
        1 {invertPrice ? quoteTokenInfo!.symbol : baseTokenInfo!.symbol} ={" "}
        {stringToSignificantDecimals(price.toString())}{" "}
        {invertPrice ? baseTokenInfo!.symbol : quoteTokenInfo!.symbol}
        <RevertPriceButton
          icon="swap"
          ariaLabel={t("orders.revertPrice")}
          iconSize={1}
          onClick={() => setInvertPrice((p) => !p)}
        />
      </StyledInfoHeading>
    );
  }

  if (hasSelectedCustomServer) {
    return (
      <StyledInfoHeading>
        {t("orders.selectedServer", { serverUrl })}
      </StyledInfoHeading>
    );
  }

  return <StyledInfoHeading>Get a price.</StyledInfoHeading>;
};

export default InfoSection;
