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
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (
      containerRef.current &&
      scrollContainerRef.current &&
      buttonRef.current
    ) {
      const { offsetTop, scrollHeight } = scrollContainerRef.current;
      const { scrollHeight: buttonHeight } = buttonRef.current;
      setOverflow(
        scrollHeight + offsetTop + buttonHeight >
          containerRef.current.offsetHeight
      );
    }
  }, [containerRef, scrollContainerRef, width, height, errors.length]);

  return (
    <Container ref={containerRef}>
      <LegendDivider />
      <StyledScrollContainer $overflow={overflow} ref={scrollContainerRef}>
        <StyledErrorList>
          {errors.map((error) => {
            return <ErrorListItem key={error} error={error} />;
          })}
        </StyledErrorList>
      </StyledScrollContainer>
      <OverlayActionButton ref={buttonRef} onClick={handleClick}>
        {t("common.back")}
      </OverlayActionButton>
    </Container>
  );
};
