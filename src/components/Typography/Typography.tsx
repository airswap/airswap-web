import React, { FC, ReactElement, ElementType } from "react";

import { DefaultTheme, StyledComponent } from "styled-components/macro";

import { StyledH1, StyledH2, StyledH3, StyledH4 } from "./Typography.styles";

type TitleType = "h1" | "h2" | "h3" | "h4";

export type TitleProps = {
  children: React.ReactNode;
  className?: string;
  type: TitleType;
  as?: ElementType;
};

const titles: Record<
  TitleType,
  StyledComponent<keyof JSX.IntrinsicElements, DefaultTheme>
> = {
  h1: StyledH1,
  h2: StyledH2,
  h3: StyledH3,
  h4: StyledH4,
};

export const Title: FC<TitleProps> = ({
  className,
  children,
  type,
  as,
}): ReactElement => {
  const StyledTitle = titles[type];

  return (
    <StyledTitle as={as || type} className={className}>
      {children}
    </StyledTitle>
  );
};

export {
  StyledSubtitle as Subtitle,
  StyledParagraph as Paragraph,
  StyledInfoHeading as InfoHeading,
  StyledInfoSubHeading as InfoSubHeading,
  StyledFormLabel as FormLabel,
  StyledFormInput as FormInput,
  StyledSelectItem as SelectItem,
  StyledLink as Link,
  StyledNavigation as Navigation,
  StyledMetadata as Metadata,
  StyledSubText as SubText,
} from "./Typography.styles";
