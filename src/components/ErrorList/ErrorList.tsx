import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import type { ErrorType } from "../../constants/errors";
import useWindowSize from "../../hooks/useWindowSize";
import { OverlayActionButton } from "../Overlay/Overlay.styles";
import {
  Container,
  StyledErrorList,
  LegendDivider,
  StyledScrollContainer,
} from "./ErrorList.styles";
import ErrorListItem from "./subcomponents/ErrorListItem/ErrorListItem";

type ErrorListProps = {
  errors: ErrorType[];
  handleClick: () => void;
};

export const ErrorList = ({ errors = [], handleClick }: ErrorListProps) => {
  const { t } = useTranslation();

  return (
    <Container>
      <LegendDivider />
      <StyledScrollContainer>
        <StyledErrorList>
          {errors.map((error) => {
            return <ErrorListItem key={error} error={error} />;
          })}
        </StyledErrorList>
      </StyledScrollContainer>
      <OverlayActionButton onClick={handleClick}>
        {t("common.back")}
      </OverlayActionButton>
    </Container>
  );
};
