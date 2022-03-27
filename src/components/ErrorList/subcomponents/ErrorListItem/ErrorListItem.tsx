import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { getMessageFromCode } from "eth-rpc-errors";

import {
  airswapProviderErrorList,
  airswapProviderErrorTranslationMap,
  Error,
  ErrorCodesMap,
} from "../../../../constants/errors";
import { InfoHeading } from "../../../Typography/Typography";
import {
  ErrorTextContainer,
  Container,
  StyledErrorIcon,
  StyledSubText,
} from "./ErrorListItem.styles";

export interface ErrorListItemProps {
  error: Error;
}

const ErrorListItem: FC<ErrorListItemProps> = ({ error }) => {
  const { t } = useTranslation();

  const translation = useMemo(() => {
    const airswapProviderError = airswapProviderErrorList.find(
      (a) => a === error
    );

    // Translations for airswap provider errors are in the translation file
    if (airswapProviderError) {
      return t(
        `validatorErrors.${airswapProviderErrorTranslationMap[airswapProviderError]}`
      );
    }

    // Translations for ethereum rpc and provider errors are sourced from the eth-rpc-errors library
    return getMessageFromCode(ErrorCodesMap[error], t("common.undefined"));
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <StyledErrorIcon name="information-circle-outline" iconSize={1.5} />
      <ErrorTextContainer>
        <InfoHeading>{error}</InfoHeading>
        <StyledSubText>{translation}</StyledSubText>
      </ErrorTextContainer>
    </Container>
  );
};

export default ErrorListItem;
