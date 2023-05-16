import { FC } from "react";

import {
  Container,
  TitleContainer,
  Line,
  Title,
} from "./PopoverSection.styles";

type PopoverSectionType = {
  title?: string;
  className?: string;
};

const PopoverSection: FC<PopoverSectionType> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <Container className={className}>
      {title && (
        <TitleContainer>
          <Title type="h4">
            <Line>{title}</Line>
          </Title>
        </TitleContainer>
      )}
      {children}
    </Container>
  );
};

export default PopoverSection;
