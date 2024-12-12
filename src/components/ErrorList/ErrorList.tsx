import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { AppError } from "../../errors/appError";
import { OverlayActionButton } from "../ModalOverlay/ModalOverlay.styles";
import {
  Container,
  StyledErrorList,
  StyledScrollContainer,
} from "./ErrorList.styles";
import { getAppErrorTranslation } from "./helpers";
import ErrorListItem from "./subcomponents/ErrorListItem/ErrorListItem";

type ErrorListProps = {
  errors: AppError[];
  onBackButtonClick: () => void;
};

export const ErrorList = ({
  errors = [],
  onBackButtonClick,
}: ErrorListProps) => {
  const { t } = useTranslation();

  const errorListItems = useMemo(
    () => errors.map((error) => getAppErrorTranslation(error)),
    [errors]
  );

  return (
    <Container>
      <StyledScrollContainer $overflow>
        {errorListItems.map((error) => (
          <ErrorListItem
            key={error.title}
            title={error.title}
            text={error.text}
          />
        ))}
      </StyledScrollContainer>
      <OverlayActionButton onClick={onBackButtonClick}>
        {t("common.back")}
      </OverlayActionButton>
    </Container>
  );
};
