import { FC } from "react";
import { useTranslation } from "react-i18next";

import { PricingErrorType } from "../../../../../errors/pricingError";
import { InfoSectionHeading } from "../../../../../styled-components/InfoSection/InfoSection";

export type PricingErrorInfoProps = {
  pricingError: PricingErrorType;
};

const PricingErrorInfo: FC<PricingErrorInfoProps> = ({ pricingError }) => {
  const { t } = useTranslation();

  if (pricingError === PricingErrorType.belowMinimumAmount) {
    return (
      <>
        <InfoSectionHeading>
          Requested price under minimum amount
        </InfoSectionHeading>
      </>
    );
  }

  if (pricingError === PricingErrorType.noServersFound) {
    return (
      <>
        <InfoSectionHeading>{t("orders.noValidResponses")}</InfoSectionHeading>
      </>
    );
  }

  return (
    <>
      <InfoSectionHeading>
        {t("orders.tokenPairUnavailable")}
      </InfoSectionHeading>
    </>
  );
};

export default PricingErrorInfo;
