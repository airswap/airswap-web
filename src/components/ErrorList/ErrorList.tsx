import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getMessageFromCode } from "eth-rpc-errors";

import {
  airswapProviderErrorList,
  ErrorCodes,
  ErrorType,
} from "../../constants/errors";
import useWindowSize from "../../helpers/useWindowSize";
import { OverlayActionButton } from "../Overlay/Overlay.styles";
import { InfoHeading, InfoSubHeading } from "../Typography/Typography";
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
import getErrorTranslation from "./helpers/getErrorTranslation";

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

  const StyledErrors = () => {
    if (!errors.length) return <></>;

    return (
      <>
        {errors.map((error, idx) => {
          // @ts-ignore
          const translation = airswapProviderErrorList.find((a) => a === error)
            ? t(`validatorErrors.${error.toLowerCase()}`)
            : getMessageFromCode(ErrorCodes[error]);

          return (
            <StyledError key={idx}>
              <StyledErrorIcon
                name="information-circle-outline"
                iconSize={1.5}
              />
              <ErrorTextContainer>
                <InfoHeading>{error}</InfoHeading>
                <StyledSubText>{translation}</StyledSubText>
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
