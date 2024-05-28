import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import {
  StyledInfoHeading,
  StyledInfoSubHeading,
} from "../../../../Typography/Typography.styles";
import { Container } from "./InfoSection.styles";

type ActionButtonsProps = {
  isAllowancesFailed: boolean;
  className?: string;
};

const InfoSection: FC<ActionButtonsProps> = ({
  isAllowancesFailed,
  className,
}) => {
  const { t } = useTranslation();

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
