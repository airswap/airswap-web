import { FC } from "react";
import { useTranslation } from "react-i18next";

import {
  Container,
  FilledAmount,
  FilledBarContainer,
  FilledBarProgress,
  FilledPercentage,
  Title,
} from "./FilledBar.styles";

interface FilledBarProps {
  filledAmount?: string;
  filledPercentage: number;
  tokenSymbol?: string;
  className?: string;
}

export const FilledBar: FC<FilledBarProps> = ({
  filledAmount,
  filledPercentage,
  tokenSymbol = "?",
  className,
}) => {
  const roundedFilledPercentage = Math.round(filledPercentage * 100) / 100;

  return (
    <Container className={className}>
      <FilledAmount>
        <Title>Filled:</Title>
        {`${filledAmount} ${tokenSymbol}`}
        <FilledPercentage>{`(${roundedFilledPercentage}%)`}</FilledPercentage>
      </FilledAmount>

      <FilledBarContainer>
        <FilledBarProgress filledPercentage={roundedFilledPercentage} />
      </FilledBarContainer>
    </Container>
  );
};
