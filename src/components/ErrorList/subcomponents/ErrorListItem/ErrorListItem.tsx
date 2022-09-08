import React, { FC } from "react";

import { InfoHeading } from "../../../Typography/Typography";
import {
  ErrorTextContainer,
  Container,
  StyledErrorIcon,
  StyledSubText,
} from "./ErrorListItem.styles";

export interface ErrorListItemProps {
  title: string;
  text?: string;
}

const ErrorListItem: FC<ErrorListItemProps> = ({ title, text }) => {
  return (
    <Container>
      <StyledErrorIcon name="information-circle-outline" iconSize={1.5} />
      <ErrorTextContainer>
        <InfoHeading>{title}</InfoHeading>
        {text && <StyledSubText>{text}</StyledSubText>}
      </ErrorTextContainer>
    </Container>
  );
};

export default ErrorListItem;
