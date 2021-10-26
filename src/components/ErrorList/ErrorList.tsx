import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import validatorErrors from "../../../public/locales/en/validatorErrors.json";
import useWindowSize from "../../helpers/useWindowSize";
import IconError from "../Icon/icons/IconError";
import { ScrollContainer, Container } from "../TokenList/TokenList.styles";
import { InfoHeading, SubText } from "../Typography/Typography";
import {
  StyledErrorList,
  StyledError,
  ErrorIconContainer,
  ErrorTextContainer,
} from "./ErrorList.styles";

type Error = keyof typeof validatorErrors;

type ErrorListProps = {
  errors: Error[];
  onClick: () => void;
};

const ErrorList = ({ errors, onClick }: ErrorListProps) => {
  const { t } = useTranslation(["validatorErrors"]);
  const containerRef = useRef<HTMLDivElement>(null);
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
              <ErrorIconContainer>
                <IconError />
              </ErrorIconContainer>
              <ErrorTextContainer>
                <InfoHeading>{t(`validatorErrors:${error}`)}</InfoHeading>
                <SubText>{t(`validatorErrors:${subText}`)}</SubText>
              </ErrorTextContainer>
            </StyledError>
          );
        })}
      </>
    );
  };

  useEffect(() => {
    if (containerRef.current && scrollContainerRef.current) {
      const { offsetTop, scrollHeight } = scrollContainerRef.current;
      setOverflow(scrollHeight + offsetTop > containerRef.current.offsetHeight);
    }
  }, [containerRef, scrollContainerRef, width, height]);
  return (
    <>
      <Container ref={containerRef} $overflow={overflow}>
        <ScrollContainer ref={scrollContainerRef}>
          <StyledErrorList>
            <StyledErrors />
          </StyledErrorList>
        </ScrollContainer>
      </Container>
    </>
  );
};

export default ErrorList;