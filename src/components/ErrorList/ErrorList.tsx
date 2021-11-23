import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import translation from "../../../public/locales/en/translation.json";
import useWindowSize from "../../helpers/useWindowSize";
import { OverlayActionButton } from "../Overlay/Overlay.styles";
import { InfoHeading } from "../Typography/Typography";
import {
  Container,
  StyledErrorList,
  StyledError,
  ErrorTextContainer,
  LegendDivider,
  StyledScrollContainer,
  StyledErrorIcon,
  StyledSubText,
} from "./ErrorList.styles";

export type Error = keyof typeof translation["validatorErrors"];

type ErrorListProps = {
  errors: Error[];
  handleClick: () => void;
};

export const ErrorList = ({ errors = [], handleClick }: ErrorListProps) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);
  const { width, height } = useWindowSize();

  const StyledErrors = () => {
    if (!errors.length) return <></>;
    return (
      <>
        {errors.map((error, idx) => {
          const subText = error.toLowerCase() as Error;
          return (
            <StyledError key={idx}>
              <StyledErrorIcon
                name="information-circle-outline"
                iconSize={1.5}
              />
              <ErrorTextContainer>
                <InfoHeading>{t(`validatorErrors.${error}`)}</InfoHeading>
                <StyledSubText>{t(`validatorErrors.${subText}`)}</StyledSubText>
              </ErrorTextContainer>
            </StyledError>
          );
        })}
      </>
    );
  };

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
          <StyledErrors />
        </StyledErrorList>
      </StyledScrollContainer>
      <OverlayActionButton ref={buttonRef} onClick={handleClick}>
        {t("common.back")}
      </OverlayActionButton>
    </Container>
  );
};
