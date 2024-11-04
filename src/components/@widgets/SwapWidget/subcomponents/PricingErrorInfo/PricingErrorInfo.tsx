import { FC } from "react";
import { useTranslation } from "react-i18next";

import { PricingErrorType } from "../../../../../errors/pricingError";
import { InfoSubHeading } from "../../../../Typography/Typography";
import { StyledInfoHeading } from "../InfoSection/InfoSection.styles";

export type PricingErrorInfoProps = {
  pricingError: PricingErrorType;
};

const PricingErrorInfo: FC<PricingErrorInfoProps> = ({ pricingError }) => {
  const { t } = useTranslation();

  if (pricingError === PricingErrorType.belowMinimumAmount) {
    return (
      <>
        <StyledInfoHeading>
          Requested price under minimum amount
        </StyledInfoHeading>
      </>
    );
  }

  if (pricingError === PricingErrorType.noServersFound) {
    return (
      <>
        <StyledInfoHeading>No servers found at this time</StyledInfoHeading>
      </>
    );
  }

  return (
    <>
      <StyledInfoHeading>{t("orders.tokenPairUnavailable")}</StyledInfoHeading>
    </>
  );
};

export default PricingErrorInfo;
