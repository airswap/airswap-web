import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import {
  StyledInfoHeading,
  StyledInfoSubHeading,
} from "../../../../Typography/Typography.styles";
import { Container } from "./InfoSection.styles";

type ActionButtonsProps = {
  isAllowancesFailed: boolean;
  isNetworkUnsupported: boolean;
  className?: string;
};

const InfoSection: FC<ActionButtonsProps> = ({
  isAllowancesFailed,
  isNetworkUnsupported,
  className,
}) => {
  const { t } = useTranslation();

  if (isNetworkUnsupported) {
    return (
      <Container className={className}>
        <StyledInfoHeading>{t("wallet.unsupportedNetwork")}</StyledInfoHeading>
      </Container>
    );
  }

  if (isAllowancesFailed) {
    return (
      <Container className={className}>
        <StyledInfoHeading>
          {t("balances.failedToFetchAllowances")}
        </StyledInfoHeading>
        <StyledInfoSubHeading>
          {t("balances.failedToFetchAllowancesCta")}
        </StyledInfoSubHeading>
      </Container>
    );
  }

  return null;
};

export default InfoSection;
