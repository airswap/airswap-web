import { FC } from "react";
import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/utils";

import { BigNumber } from "bignumber.js";

import { PricingErrorType } from "../../../../../errors/pricingError";
import { InfoSectionHeading } from "../../../../../styled-components/InfoSection/InfoSection";
import { PriceConverter } from "../../../../PriceConverter/PriceConverter";
import PricingErrorInfo from "../PricingErrorInfo/PricingErrorInfo";

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

  if (!isConnected) {
    return (
      <InfoSectionHeading>{t("marketing.welcomeMessage")}</InfoSectionHeading>
    );
  }

  if (isNetworkUnsupported) {
    return (
      <InfoSectionHeading>{t("wallet.unsupportedNetwork")}</InfoSectionHeading>
    );
  }

  if (failedToFetchAllowances) {
    return (
      <InfoSectionHeading>
        {t("balances.failedToFetchAllowances")}
      </InfoSectionHeading>
    );
  }

  if (isConnected && failedToFetchAllowances && !!bestQuote) {
    return (
      <InfoSectionHeading>
        {t("balances.failedToFetchAllowances")}
      </InfoSectionHeading>
    );
  }

  if (isFetchingOrders) {
    return (
      <InfoSectionHeading>{t("orders.findingBestPrice")}</InfoSectionHeading>
    );
  }

  if (pricingError) {
    return <PricingErrorInfo pricingError={pricingError} />;
  }

  if (bestQuote) {
    let price = new BigNumber(bestQuote).dividedBy(baseAmount);

    return (
      <PriceConverter
        baseTokenSymbol={baseTokenInfo!.symbol}
        price={price}
        quoteTokenSymbol={quoteTokenInfo!.symbol}
      />
    );
  }

  if (hasSelectedCustomServer) {
    return (
      <InfoSectionHeading>
        {t("orders.selectedServer", { serverUrl })}
      </InfoSectionHeading>
    );
  }

  return <InfoSectionHeading>Get a price.</InfoSectionHeading>;
};

export default InfoSection;
