import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { AppError } from "../../errors/appError";
import { OverlayActionButton } from "../Overlay/Overlay.styles";
import {
  Container,
  StyledErrorList,
  LegendDivider,
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
      <LegendDivider />
      <StyledScrollContainer>
        <StyledErrorList>
          {errorListItems.map((error) => (
            <ErrorListItem
              key={error.title}
              title={error.title}
              text={error.text}
            />
          ))}
        </StyledErrorList>
      </StyledScrollContainer>
      <OverlayActionButton onClick={onBackButtonClick}>
        {t("common.back")}
      </OverlayActionButton>
    </Container>
  );
};
