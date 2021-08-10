import React, { FC, ReactElement } from "react";

import { StyledH1, StyledH2, StyledH3, StyledH4 } from "./Typography.styles";

type TitleType = "h1" | "h2" | "h3" | "h4";

export type TitleProps = {
  children: React.ReactNode;
  className?: string;
  type: TitleType;
};

const titles: Record<TitleType, FC<{ className?: string }>> = {
  h1: StyledH1,
  h2: StyledH2,
  h3: StyledH3,
  h4: StyledH4,
};

export const Title: FC<TitleProps> = ({
  className,
  children,
  type,
}): ReactElement => {
  const StyledTitle = titles[type];

  return <StyledTitle className={className}>{children}</StyledTitle>;
};

export {
  StyledSubtitle as Subtitle,
  StyledParagraph as Paragraph,
  StyledInfoHeading as InfoHeading,
  StyledInfoSubHeading as InfoSubHeading,
  StyledFormLabel as FormLabel,
  StyledFormInput as FormInput,
  StyledSelectItem as SelectItem,
  StyledNavigation as Navigation,
  StyledMetadata as Metadata,
} from "./Typography.styles";
